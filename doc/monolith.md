# MONOLITH MODE

### Description

The **monolith** mode is the commonly used format for most of the projects.

Its characteristics makes it useful for small, not much complicated projects,
where the amount of terms to translate is low and easily manageable using a
unique file (a monolithic file).

However, in this mode it's possibile to manage a medium/big project, too.

### File format

The monolith format requires only a file to manage meta data and terms database.

The file **must be in valid JSON format**. The following is the structure:

```json
{
  "meta": {
    "format": "monolith",
    "dest": "./_locales/",
    "locales": [ "it", "en" ]
  },
  "database": {
    "term1": {
      "description": "this is the term number 1",
      "locales": {
        "it": "questo è il termine numero 1",
        "en": "this is the term number 1"
      }
    },
    "termNo": {
      "description": "this is the term number #",
      "placeholders": {
        "index": {
          "content": "$1",
          "example": "this is the term number 5"
        }
      },
      "locales": {
        "it": "questo è il termine numero $index$",
        "en": "this is the term number $index$"
      }
    }
  }
}
```

### META Descriptor

In monolith mode, the `meta` descriptor requires only three fields to be defined:

- `format`: this field is a *string* and **must** be set to `monolith`
- `dest`: this field is a *string* and **must** be set to the destination
  directory where the project have to be built. The path **must** end with a
  trailing path separator or the field will be invalid.
- `locales`: this field is an *array* and **must** be set with one item at least.
  Items defined inside this array are the country codes supported by your
  extension/application. They are conforming to the [country codes] [cc-list]
  supported by the Chrome Store

In this mode, no other fields are required in meta descriptor. However, no
restrictions are made to the amount of informations you can add to this
descriptor. Important is that the informations you add don't conflicts with
the supported ones.

For example, in your `meta` you could add some copyright informations:

```json
{
  "meta": {
    "name": "Just an example",
    "author": "Me and myself"
    "format": "monolith",
    "dest": "./_locales/",
    "locales": [ "it", "en" ]
  },
  ...
}
```

and this will be perfectly valid.

### DATABASE Descriptor

The `database` descriptor is required only in this mode. It allows the developer
to define the whole database of translated terms for all the languages supported
by your application.

As you can see, the fields used inside this descriptor are pretty the same you
already use when write by hand every single localization file, with just something
more:

- `term`: every term in database **must** be defined with a unique key (as for
  the Chrome i18n specifics)
- `description`: an optional *string* that describes the translated term
- `placeholders`: this is the same already used in plain Chrome i18n locales. It
  defines placeholders used inside the translated messages.
- `locales`: this is an *object* (not present into the Chrome i18n specifics) that
  describes the translated messages for all your supported languages. It **should**
  define a key for every locale defined in meta's `locales` field. It's not
  mandatory, but for every missing key a warning message will be generated and
  an automatic placeholder will be added into the generated project.

Please note that no other integrity checks are performed on the data, so you
could **potentially** add every information you want in this descriptor, but
the resulting project will be (almost for sure) invalid in Chrome.

## EXAMPLE

For this example we assume a file `dictionary.json` under the current directory,
with the following structure:

```json
{
  "meta": {
    "format": "monolith",
    "dest": "./_locales/",
    "locales": [ "it", "en" ]
  },
  "database": {
    "appTitle": {
      "description": "the app title",
      "locales": {
        "it": "La mia prima app tradotta",
        "en": "My First Translated App"
      }
    },
    "appDescription": {
      "description": "the description for the app store",
      "placeholders": {
        "index": {
          "content": "$1",
          "example": "This is the app number 4 developed by me"
        }
      },
      "locales": {
        "it": "Questa è la app numero $index$ sviluppata da me",
        "en": "This is the app number $index$ developed by me"
      }
    }
  }
}
```

and a starting directory structure like that:

```
Current Directory
|
+--> dictionary.json
```

then, to build the project, we have to type one of these forms:

```shell
chrome-i18n
chrome-i18n -f dictionary.json
chrome-i18n --file dictionary.json
```

and once hit the enter key and waited for a while, we should have something like
that:

```
Current Directory
|
+--> _locales/
|    |
|    +--> en/
|    |    |
|    |    +--> messages.json
|    |
|    +--> it/
|         |
|         +--> messages.json
|
+--> dictionary.json
```

If something goes wrong, when the command exits a list of warnings and errors is
printed on the error console.

[cc-list]:  https://developers.google.com/chrome/web-store/docs/i18n?hl=it#localeTable
