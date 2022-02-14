# How to run (Docker)
add a `keys.js` file in the `front-end` directory, and add the following code:
```js
export default class ApiKeys {
    static getNSKey() {
        return "{API Key}";
    }
}
```
Where `{API Key}` needs to be replaced with an actual API Key.

Then run the docker-compose file

# How to run (Windows)
add a `keys.js` file in the `front-end` directory, and add the following code:
```js
export default class ApiKeys {
    static getNSKey() {
        return "{API Key}";
    }
}
```
Where `{API Key}` needs to be replaced with an actual API Key.

Then run `nginx.exe` in the `nginx-1.21.6` directory.
When changes are made to the project and you want to see the changes, run the following command in the `nginx-1.21.6` directory: `.\nginx.exe -s reload`
