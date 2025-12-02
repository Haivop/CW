const sanitizeHtml = require('sanitize-html');
const { getLikedTracks, getSavedPlaylists } = require("../controllers/CatalogueController");

module.exports.querySaved = (compareUserId) => {
    compareUserId = compareUserId !== undefined ? compareUserId : null;
    return {
        where: {
            user_id: compareUserId,
        },
        raw: true
    }
};

module.exports.queryOwned = (compareUserId) => {
    compareUserId = compareUserId !== undefined ? compareUserId : null;
    return {
        where: {
            owner_id: compareUserId,
        },
        raw: true
    }
};

module.exports.queryUser_TrackIdIntersection = (compareUserId, compareTrackId) => {
    compareUserId = compareUserId !== undefined ? compareUserId : null;
    return {
        where: {
            user_id: compareUserId,
            track_id: compareTrackId,
        }
    }
};

module.exports.queryUser_PlaylistIdIntersection = (compareUserId, comparePlaylistId) => {
    compareUserId = compareUserId !== undefined ? compareUserId : null;
    return {
        where: {
            user_id: compareUserId,
            playlist_id: comparePlaylistId,
        }
    }
};

module.exports.queryById = (compareId) => {
    return {
        where: {
            id: compareId,
        }
    }
};

module.exports.mergePatch = async (newData, oldData) => {
    for(let key in newData){
        if(oldData[key] === undefined) throw new Error("wrong key in put request body");
        else if(!newData[key]) continue;

        sanitizeHtml(newData[key]);
        oldData[key] = newData[key];
    };

    return oldData;
}

module.exports.appendTracksMeta = async (userId, tracks) => {
    const likedTracks = await getLikedTracks(this.querySaved(userId));

    tracks.forEach((track) => {
        track.isLiked = likedTracks.some(liked_track => liked_track.id === track.id );
        track.isOwner = track.owner_id === userId;
    });

    return tracks;
}

module.exports.appendPlaylistsMeta = async (userId, playlists) => {
    const savedPlaylists = await getSavedPlaylists(this.querySaved(userId));

    playlists.forEach((playlist) => {
        playlist.isSaved = savedPlaylists.some(saved_playlist => saved_playlist.id === playlist.id);
        playlist.isOwner = playlist.owner_id === userId;
    });

    return playlists;
}