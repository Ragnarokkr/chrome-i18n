# Monolith Mode

* [Description](#description)
* [File format](#file-format)
    * [Meta Descriptor](#meta-descriptor)
    * [Database Descriptor](#database-descriptor)
* [Example](#example)

## Description

The **monolith** mode is the commonly used format for most of the projects.
It's more useful for small simple projects, where the amount of terms to 
translate is low and easily manageable through an unique file (a monolithic 
file). Anyway, in this mode it's still possible yet not easy to manage a 
medium/big project.


## File format

This mode requires only a file to manage meta data and database of the terms.

The file **must be** in a valid and well-formed JSON format. The structure has
to be similiar to the following:

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


### Meta Descriptor

In monolith mode, the `meta` descriptor requires only three fields:

Field | Type | Description
---|:-:|---
format|`String`|it **must** be set to `monolith`
dest|`String`|the target directory for the **_locales** directory. The path **must** end with a trailing path separator or the field will be invalid
locales|`Array`|supported country codes by your extension/application. They **must** be compliant to the [country codes][cc-list] supported by the Chrome Store

In this mode, no other fields are required. However, no restrictions are made 
to the amount of informations you can add to this descriptor. Important is that
the informations you add don't generate conflicts with the supported ones.

For example, in your `meta` you could add some copyright informations:

```json
{
    "meta": {
        "name": "Just an example",
        "author": "Me and myself",
        "format": "monolith",
        "dest": "./_locales/",
        "locales": [ "it", "en" ]
    },
    .
    .
    .
}
```

and this would be perfectly valid.


### Database Descriptor

The `database` descriptor is required only in this mode. It allows you to define
the whole database of translated terms for all the languages supported by your
application.

This descriptor is a JSON object whose keys are the identifiers for the strings
to be translated. As you can see, the fields used for each key are pretty the 
same used when you write by hand every single localization file, with something 
more:

Field | Type | Description
---|:-:|---
*description*|`String`|a description of the translated term. **Optional**
*placeholders*|`Object`|same as the one used in plain Chrome i18n locales. It defines which placeholders are used inside the translated messages. **Optional**
locales|`Object`|it describes the translated messages for all your supported languages. It **should** define a key for all the languages defined in [`locales`](#meta-descriptor) field. It's not mandatory, but for every missing key a warning message will be generated and an automatic placeholder will be added into the generated project.

Please, note that no further integrity check is performed on the data, so you
could **potentially** add every information you want in this descriptor, but
the resulting project will be (almost for sure) invalid in Chrome.


## Example

For this example we assume a file **dictionary.json** with the following structure:

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
Current Directory/
└── dictionary.json
```

then, to build the project, we have to execute the program using one of these 
three forms:

```bash
$ chrome-i18n
$ chrome-i18n -f dictionary.json
$ chrome-i18n --file dictionary.json
```

and once hit the enter key and waited for a while, we should have something like
that:

```
Current Directory
├── dictionary.json
└── _locales
    ├── en
    │   └── messages.json
    └── it
        └── messages.json
```

If something goes wrong, when the command exits a list of warnings and errors is
printed on the error console.


[cc-list]: https://developers.google.com/chrome/web-store/docs/i18n?hl=it#localeTable

