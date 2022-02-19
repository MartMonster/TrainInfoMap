# How to run (Docker)
add a `keys.json` file in the `front-end` directory, and add the following code:
```json
{
    "keys": [{
        "name": "NS",
        "key": "{API Key}"
    }]
}
```
Where `{API Key}` needs to be replaced with an actual API Key.

Then run the docker-compose file

# How to run (Windows)
add a `keys.json` file in the `front-end` directory, and add the following code:
```json
{
    "keys": [{
        "name": "NS",
        "key": "{API Key}"
    }]
}
```
Where `{API Key}` needs to be replaced with an actual API Key.

Then run `nginx.exe` in the `nginx-1.21.6` directory.
When changes are made to the config files and you want to see the changes, run the following command in the `nginx-1.21.6` directory: `.\nginx.exe -s reload`
