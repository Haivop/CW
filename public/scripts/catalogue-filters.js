document.addEventListener("DOMContentLoaded", () => {
    const filters = document.getElementsByClassName("filter-btn");
    const abreviationDict = {
        "uploaded-tr": "upl",
        "liked-tr": "lk",
        "created-pl": "cr",
        "saved-pl": "sv",
    };

    for(let filter of filters){
        filter.addEventListener("click", (event) => {
            const key = event.target?.attributes?.value?.value;
            if (!key || !abreviationDict[key]) return;

            const abbreviation = abreviationDict[key];
            const values = Object.values(abreviationDict);
            const url = window.location.href;

            const hasT = url.includes("?t=");
            const hasThis = url.includes(`${abbreviation},`) || url.endsWith(abbreviation);
            const hasAny = values.some(a => url.includes(a));

            // Якщо в URL вже є t= з абревіатурами
            if (hasAny) {
                if (hasThis) {
                    // Видаляємо abbr
                    let newUrl = url
                        .replace(`${abbreviation},`, "")
                        .replace(`,${abbreviation}`, "")
                        .replace(`${abbreviation}`, "");

                    // видаляємо зайві коми та зайвий "?"
                    newUrl = newUrl.replace(/,+/g, ",")
                                .replace(/,\?/g, "?")
                                .replace(/\?$/, "");

                    window.location.href = newUrl;
                } else {
                    // Для інших абревіатур — видаляємо їх і ставимо наш abbr
                    let newUrl = url;

                    values.forEach(a => {
                        newUrl = newUrl
                            .replace(`${a},`, "")
                            .replace(`,${a}`, "")
                            .replace(a, "");
                    });

                    newUrl = newUrl.replace(/,+/g, ",")
                                .replace(/\?t=,/, "?t=")
                                .replace(/\?t=$/, `?t=${abbreviation},`);

                    window.location.replace(newUrl);
                }
                return;
            }

            // Якщо параметр t вже існує
            if (hasT) {
                window.location.replace(url + `${abbreviation},`);
                return;
            }

            // Якщо t ще немає
            window.location.replace(url + `?t=${abbreviation},`);
        });
    };
});