function DropdownElement({ cluster }: { cluster: [string, string[]] }) {
    return <div className="DropdownElement">
        <div className="dropdown-label">
            {cluster[0]}
        </div>
        <div className="dropdown-content">
            <ul>
                {cluster[1].map(value => <li key={value}>{value}</li>)}
            </ul>
        </div>
    </div>
}

function DropdownColumn({ clusters }: { clusters: [string, string[]][] }) {
    return <div className="DropdownColumn">
        {clusters.map((value, i) => <DropdownElement key={i} cluster={value}/>)}
    </div>
}

export function Dropdown() {
    const clusters: { [key: string]: string[] } = {
        "Деньги": [
            "Деньги",
            "Бабки",
            "Бабосики",
            "Кэш",
            "Мани",
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

    const columns = [0, 1, 2].map(c => Object.entries(clusters).filter((_, i) => i % 3 === c));

    return <div className="Dropdown">
        <ul>
            {columns.map((value, i) => <li key={i}><DropdownColumn clusters={value} /></li>)}
        </ul>
    </div>
}