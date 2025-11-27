async function like() {
    fetch(window.location.href, {
            method: 'PATCH',
    }).then(() => {window.location.reload()});
}