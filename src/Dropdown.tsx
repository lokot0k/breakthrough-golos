function DropdownElement({ cluster }: { cluster: [string, string[]] }) {
    return <div className="DropdownElement">
        {cluster[0]}
        <div className="dropdown-content">
            <ul>
                {cluster[1].map(value => <li key={value}>{value}</li>)}
            </ul>
        </div>
    </div>
}

export function Dropdown() {
    const clusters: { [key: string]: string[] } = {
        "Деньги": [
            "Деньги",
            "Бабки",
            "Бабосики",
            "Кэш",
            "Мани"
        ],
        "Семья": [
            "Семья",
            "Жена и дети",
            "Дети",
            "Родители",
            "Моя семья"
        ],
        "Друзья": [
            "Друзья",
            "Лучшие друзья"
        ],
        "Юмор": [
            "Шутки",
            "Приколы",
            "Разъебы",
            "Анекдоты",
            "Приколюхи"
        ]
    }

    return <div className="Dropdown">
        <ul>
            {Object.entries(clusters).map(value => <li key={value[0]}><DropdownElement cluster={value} /></li>)}
        </ul>
    </div>
}