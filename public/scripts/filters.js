document.addEventListener("DOMContentLoaded", () => {
    const filters = document.getElementsByClassName("filter-btn");
    const abreviationDict = {
        "tracks": "tr",
        "playlists": "pl",
        "profiles": "pr",
        "artists": "ar",
        "genres": "gn",
    };

    for(let filter of filters){
        filter.addEventListener("click", (event) => {
            const matchRegExp = new RegExp(`&f=.*${abreviationDict[event.target.innerHTML.toLowerCase()]}.*`);
            const abreviation = abreviationDict[event.target.innerHTML.toLowerCase()];
            let url = window.location.href;

            if(url.match(matchRegExp)){
                const replaceRegExp = new RegExp(`(?:&f=)?${abreviation},?$`)

                if(!url.match(replaceRegExp)) {
                    window.location.href = url.replace(new RegExp(`${abreviation},`), "");
                } else {
                    window.location.href = url.replace(replaceRegExp, "");
                }

                return;
            }
            
            if(url.match(/\/search\?q=.*&f=/)) {
                if(!url.match(/\/search\?q=.*&f=.*,/)) url = url.concat(",");
                window.location.href = url.concat(`${abreviation},`);
                return;
            }

            window.location.href = url.concat(`&f=${abreviation},`);
        });
    };
});