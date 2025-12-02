document.addEventListener("DOMContentLoaded", () => {
    const filters = document.getElementsByClassName("filter-btn");
    const abreviationDict = {
        "tracks": "tr",
        "playlists": "pl",
        "profiles": "pr",
        "artists": "art",
        "genres": "gn",
    };

    for(let filter of filters){
        filter.addEventListener("click", (event) => {
            const key = event.target?.attributes?.value?.value;
            if (!key || !(key in abreviationDict)) return;

            const abbreviation = abreviationDict[key];
            const values = Object.values(abreviationDict);
            let url = window.location.href;

            const hasF = url.includes("&f=");
            const hasThis = url.includes(`${abbreviation},`) || url.endsWith(abbreviation);
            const hasAny = values.some(a => url.includes(a)); // масив значень абревіацій

            // 1. Якщо фільтр уже є в URL
            if (hasAny && hasF) {
                let newUrl = url;

                if (hasThis) {
                    // Видалити саме обраний фільтр
                    newUrl = newUrl
                        .replace(`${abbreviation},`, "")
                        .replace(`,${abbreviation}`, "")
                        .replace(`${abbreviation}`, "");
                } else {
                    // Видалити інші фільтри, замінити на новий
                    values.forEach(a => {
                        newUrl = newUrl
                            .replace(`${a},`, "")
                            .replace(`,${a}`, "")
                            .replace(a, "");
                    });
                    // Тепер додати наш
                    if (!newUrl.endsWith(",") && !newUrl.endsWith("=")) newUrl += ",";
                    newUrl += abbreviation + ",";
                }

                // Прибрати зайві коми та пустий &f=
                newUrl = newUrl
                    .replace(/,+/g, ",")
                    .replace("&f=,", "&f=")
                    .replace(/&f=$/, "");

                window.location.href = newUrl;
                return;
            }

            // 2. Якщо /search?q=...&f= існує, але список ще пустий
            if (url.includes("/search?q=") && url.includes("&f=")) {
                if (!url.endsWith(",")) url += ",";
                window.location.replace(url + abbreviation + ",");
                return;
            }

            // 3. Якщо фільтрів ще нема
            window.location.replace(url + `&f=${abbreviation},`);
        });
    };
});