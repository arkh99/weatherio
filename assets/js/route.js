// route.js

import { updateWeather, error404 } from "./app.js";

const defaultLocation = "#/weather?lat=51.5073219&lon=-0.1276474";

const currentLocation = function () {
    window.navigator.geolocation.getCurrentPosition(res => {
        const { latitude, longitude } = res.coords;
        updateWeather(latitude, longitude); // Pass numerical values directly
    }, err => {
        window.location.hash = defaultLocation;
    });
};

const searchedLocation = query => {
    const params = query.split("&").reduce((acc, param) => {
        const [key, value] = param.split("=");
        acc[key] = value;
        return acc;
    }, {});

    updateWeather(params.lat, params.lon); // Ensure params.lat and params.lon are correctly extracted
};

const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather", searchedLocation]
]);

const checkHash = function () {
    const requestURL = window.location.hash.slice(1);
    const [route, query] = requestURL.includes("?") ? requestURL.split("?") : [requestURL];

    if (routes.has(route)) {
        routes.get(route)(query);
    } else {
        error404();
    }
};

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function () {
    if (!window.location.hash) {
        window.location.hash = "#/current-location";
    } else {
        checkHash();
    }
});
