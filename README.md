# Pygmy

## Simple url shortener written in Deno using Deno KV

Pygmy is a simple url shortener written in [Deno](https://deno.com/runtime) using [Deno KV](https://deno.com/kv). Add new URLs by POSTing JSON to `/urls`. You can see all available URLs by GETing `/users` and GETing a shortened URL will redirect you.

Example curl to add a new URL:

```
curl --header "Content-Type: application/json" -X POST --data '{"url":"https://deno.com/kv","expiry":"2023-12-31"}' http://localhost:8080/urls
```

Run using tasks or deply to [Deno Deploy](https://deno.com/deploy)

```
$ deno task dev
```
