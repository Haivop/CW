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
            console.log(event.target.attributes.value);
            const matchRegExp = new RegExp(`t=.*${abreviationDict[event.target.attributes.value.value]}.*`);
            const abreviation = abreviationDict[event.target.attributes.value.value];
            const url = window.location.href;

            if(url.match(matchRegExp)){
                const replaceRegExp = new RegExp(`(?:\\?t=)?${abreviation},?$`)

                if(!url.match(replaceRegExp)) {
                    window.location.href = url.replace(new RegExp(`${abreviation},`), "");
                } else {
                    window.location.href = url.replace(replaceRegExp, "");
                }

                return;
            }
            
            if(url.match(/\/catalogue\?t=/)) {
                window.location.href = url.concat(`${abreviation},`);
                return;
            }

            window.location.href = url.concat(`?t=${abreviation},`);
        });
    };
});