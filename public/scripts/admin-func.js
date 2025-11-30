async function toggleVisibility(trackId){
    fetch(base_url + "/tracks/" + trackId, {
        method: "PATCH",
    });
};

async function blockUser(userId) {
    fetch(base_url + "/profiles/" + userId, {
        method: "PATCH",
    });
};

async function deleteUser(userId) {
    fetch(base_url + "/profiles/" + userId, {
        method: "DELETE",
    });
};