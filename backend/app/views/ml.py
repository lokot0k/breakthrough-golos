import json
import pandas as pd
import numpy as np
from django.http import HttpRequest, JsonResponse, HttpResponse
from django.views import View

from sklearn.cluster import AgglomerativeClustering
from sentence_transformers import SentenceTransformer

from transformers import GPT2Tokenizer, GPT2LMHeadModel, AutoTokenizer, \
    AutoModelForSequenceClassification, BertTokenizer, \
    BertForSequenceClassification
import math
import torch

from spellchecker import SpellChecker
from fastDamerauLevenshtein import damerauLevenshtein

class GarageModel:
    def __init__(self):
        self.tokenizer_main = AutoTokenizer.from_pretrained('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
        self.model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
        self.cluster_model = AgglomerativeClustering(metric="cosine", linkage="average", n_clusters=None, distance_threshold=0.33)

        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        self.sent_tokenizer = AutoTokenizer.from_pretrained('cointegrated/rubert-tiny-sentiment-balanced')
        self.sent_model = AutoModelForSequenceClassification.from_pretrained('cointegrated/rubert-tiny-sentiment-balanced')


        self.toxic_tokenizer = BertTokenizer.from_pretrained('SkolkovoInstitute/russian_toxicity_classifier')
        self.toxic_model = BertForSequenceClassification.from_pretrained('SkolkovoInstitute/russian_toxicity_classifier')

        if torch.cuda.is_available():
            self.sent_model.cuda()
            self.toxic_model.cuda()

        # Загрузка фильтра "плохих" слов
        self.bad_words = []

        # with open("bad_words.txt", "r", encoding='utf-8') as f:
        #     self.bad_words = f.readlines()
        #     self.bad_words = [word.replace("\n", "").strip() for word in self.bad_words]

        self.spell = SpellChecker(language=['ru'])


    def correct(self, text):
        text_corr = ""
        for word in text.split():
            word = self.clean(word)
            a = self.spell.correction(word) if len(word) >= 2 else word
            text_corr += a + " " if a else word + " "
        text_corr = text_corr[:-1]
        return text_corr

    def preprocess(self, text: str, censor=True, check_spelling=False):
        txt = self.correct(self.clean(text)) if check_spelling else self.clean(text)
        if censor:
            if self.get_is_toxic(txt):
                txt = "***"
        return txt


    def check_text(self, text):
        text = self.clean(text.lower())
        corr_text = ""
        for word in text.split(' '):
            translit_word = self.replace_english_letters(word)
            is_bad, similarity_ratio = self.is_bad_word(self.bad_words, translit_word)
            if is_bad:
                corr_text += "*" * len(word)
            else:
                corr_text += translit_word
            corr_text += " "
        return corr_text[:-1]

    def clean(self, text):
        to_remove = "?/><,.|\\\":;\'=+_~`!@#$%^&*()№"
        for i in to_remove:
            text = text.replace(i, "")
        return text


    def get_sentiment(self, text):
        with torch.no_grad():
            inputs = self.sent_tokenizer(text, return_tensors='pt', truncation=True, padding=True).to(self.sent_model.device)
            proba = torch.sigmoid(self.sent_model(**inputs).logits).cpu().numpy()
        res = proba.dot([-1, 0, 1])
        tresh = 0.33
        res[res>tresh] = 1
        res[res<-tresh] = -1
        res[(res>=-tresh)*(res<=tresh)] = 0
        return res

    def get_is_toxic(self, text):
        batch = self.toxic_tokenizer.encode(text, return_tensors='pt')
        return np.argmax(self.toxic_model(batch).logits.detach().numpy())==1

    def replace_english_letters(self, text):
        replacements = {
            'a': 'а',
            'b': 'в',
            'e': 'е',
            'k': 'к',
            'm': 'м',
            'h': 'н',
            'o': 'о',
            'p': 'р',
            'c': 'с',
            't': 'т',
            'y': 'у',
            'x': 'х'
        }

        for eng, rus in replacements.items():
            text = text.replace(eng, rus)

        return text

    def get_middlest_word(self, ans_emb, words): # для одного кластера
        middle_point = ((ans_emb.sum(axis=0))/len(ans_emb)).reshape(1, -1)
        dist = np.linalg.norm(ans_emb-middle_point, axis=1)
        return words[np.argmin(dist)]


    def read_json(self, parsed_json, censor=False, check_spelling=False,
                  show_prints=False):
        word2vec_model = self.model
        cluster_model = self.cluster_model

        question_id = parsed_json["id"]
        question = parsed_json["question"]
        answers = []
        counts = []
        corrected = []
        for answer_item in parsed_json["answers"]:
            answers.append(answer_item["answer"])

            corrected.append(
                self.preprocess(answers[-1], censor, check_spelling))
            counts.append(answer_item["count"])
        sentiment = self.get_sentiment(answers)
        if show_prints:
            print(corrected)
            print(counts)
            print(question)
            print(question_id)
            print(sentiment)
        if len(corrected) == 1:
            df = pd.DataFrame(
                {"answers": answers, "counts": counts, "cluster": corrected,
                 "sentiment": sentiment, "corrected": corrected})
        else:
            embeddings = word2vec_model.encode(corrected)
            clusters_pred = cluster_model.fit_predict(embeddings)
            if show_prints:
                print("Embeddings.shape", embeddings.shape)
                print(clusters_pred)

            df = pd.DataFrame({"answers": answers, "counts": counts,
                               "cluster": clusters_pred,
                               "sentiment": sentiment,
                               "corrected": corrected}).join(
                pd.DataFrame(embeddings))

            replacer = {}

            for cluster in set(clusters_pred):
                cluster_df = df[df["cluster"] == cluster]
                temp_ditch = cluster_df.iloc[:, 5:].values
                clus_word = self.get_middlest_word(temp_ditch, list(
                    cluster_df.corrected.values))
                replacer[cluster] = clus_word

            df["cluster"].replace(replacer, inplace=True)

        sentiment_replacer = {-1: "negatives", 1: "positives",
                              0: "neutrals"}
        df["sentiment"].replace(sentiment_replacer, inplace=True)
        df = df[["answers", "counts", "cluster", "sentiment", "corrected"]]

        def make_dict(dataframe):
            answers_json = []
            for i in range(len(dataframe)):
                line = dataframe.iloc[i]
                answers_json.append({"answer": line["answers"],
                                     "count": int(line["counts"]),
                                     "cluster": line["cluster"],
                                     "sentiment": line["sentiment"],
                                     "corrected": line["corrected"]})
            dictionary = {"question": question, "id": question_id,
                          "answers": answers_json}
            return dictionary

        return make_dict(df)


gg = GarageModel()



class MlView(View):
    def get(self, request: HttpRequest, *args,
            **kwargs) -> JsonResponse | HttpResponse:

        return JsonResponse(
            {'success': 'false', 'message': 'unsupported method'}, status=403)

    def post(self, request: HttpRequest, *args, **kwargs) -> JsonResponse:
        body = json.loads(request.body)
        return JsonResponse(gg.read_json(body))


    def head(self, request, *args, **kwargs):
        return JsonResponse(
            {'success': 'false', 'message': 'unsupported method'}, status=403)

    def put(self, request, *args, **kwargs):
        return JsonResponse(
            {'success': 'false', 'message': 'unsupported method'}, status=403)
