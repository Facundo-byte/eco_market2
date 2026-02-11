# eco_market

Sitio web responsive para una empresa de productos sustentables con:

- Registro e inicio de sesión local.
- Inicio de sesión con Google (configurable).
- Secciones: **About Us**, **Comprar**, **Contact Us** y **Carrito**.
- Carrito persistente en `localStorage`.
- Botón de pago con Mercado Pago (configurable).

## Ejecutar

Podés abrir `index.html` directo o servirlo con un server estático:

```bash
python3 -m http.server 4173
```

Luego abrí: `http://localhost:4173`

## Configurar Google Login

1. Creá un OAuth Client ID en Google Cloud.
2. En `app.js`, cargá el valor en la constante:

```js
const GOOGLE_CLIENT_ID = "TU_CLIENT_ID";
```

## Configurar Mercado Pago

1. Creá una preferencia de pago en tu backend (recomendado) o generá tu checkout link.
2. En `app.js`, pegá la URL en:

```js
const MERCADOPAGO_CHECKOUT_URL = "https://...";
```

> Nota: en producción, Mercado Pago debe integrarse con backend para crear preferencias dinámicas por carrito y usuario.
