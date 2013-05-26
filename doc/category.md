# Category Mode

* [Description](#description)
* [File format](#file-format)
    * [Meta descriptor](#meta-descriptor)
    * [Database descriptor](#database-descriptor)
* [Example](#example)

## Description

The **category** mode is useful for medium size projects, where the amount of 
terms to translate is big enough to make it difficult to manage with only one 
unique (the monolithic) file.


## File format

This mode requires that the project is splitted in more than one component:

- a **meta descriptor**: this file replicates all the fields used in `meta`
  descriptor for the monolith mode and describes which files will go to compose
  the final project
- a **database**: this is not a single file (even if it could be) but rather a 
  set of small files which will be included into the final project. In this mode, 
  each database file **must** replicate the database structure used for the 
  `database` field in monolith mode.


### Meta descriptor

The file **must be** a valid and well-formed JSON format. The following is the 
template structure:

```json
{
    "format": "category",
    "dest": "./_locales/",
    "locales": [ "it", "en" ],
    "imports": "./db/"
}
```

In category mode, the `meta` descriptor is a single file, similiar to the `meta`
descriptor we found in [monolith](monolith.md#meta-descriptor) mode, but 
without the `meta` key. It requires only four fields to be defined:

Field | Type | Description
---|:-:|---
format|`String`|it **must** be set to `category`
dest|`String`|the target directory for the **_locales** directory. The path **must** end with a trailing path separator or the field will be invalid
locales|`Array`|supported country codes by your extension/application. They **must** be compliant to the [country codes][cc-list] supported by the Chrome Store
imports<small>*</small>|`String` or `Array`|it **must** be set to at least one file or path. Globs are allowed. This field indicates where to find all the database files from which retrieve the informations.

(*) This field is validated and expanded according to some assumptions:

1. if `format` is equal to `monolith`, then it will be ignored
2. if not a `String` or `Array`, it will be invalid
3. if a `String` and no trailing path separator, then it's a file
4. if the suffix is missing, **.json** is assumed
5. if a `String` with a trailing path separator, then it's a directory
6. if a directory and no pattern is specified, <strong>*.json</strong> is assumed
7. if an `Array`, all the previous assumptions are taken and iterated.

In this mode, no other fields are required. However, no restrictions are made to
the amount of informations you can add to this descriptor. Important is that 
the informations you add don't go to conflict with the supported ones.

For example, you could add some copyright informations:

```json
{
    "name": "Just an example",
    "author": "Me and myself",
    "format": "category",
    "imports": "./db/",
    "dest": "./_locales/",
    "locales": [ "it", "en" ]
}
```

and this would be perfectly valid.


### Database descriptor

The file **must be** a valid and well-formed JSON format. The following is the 
template structure:

```json
{
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
```

It allows to split translations, grouping them by category in smaller files 
easier to be managed.

The fields inside this file are the same used for the `database` descriptor in 
[monolith](monolith.md#database-descriptor) mode. It's substantially a 
splitting of the monolith file format. (Please, refer to the monolith mode for 
a description of these fields).

Please note that no other integrity check is performed on the data, so you
could **potentially** add every information you want in this descriptor, but
the resulting project will be (almost for sure) invalid in Chrome.


## Example

Ok, I'm lazy I know it, so same example as in monolith mode.

Here we need to split the project, so we have a meta file named (for
example) **meta.json** with the following structure:

```json
{
    "format": "category",
    "imports": "./_*.json",
    "dest": "./_locales/",
    "locales": [ "it", "en" ]
}
```

and (ok I'm not so lazy) two database files named respectively **_core.json** and
**_menu.json**.

The **_core.json** file:

```json
{
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
```

and the **_menu.json** file:

```json
{
    "menuTitle": {
        "description": "the menu title",
        "locales": {
            "it": "Menu Principale",
            "en": "Main Menu"
        }
    },
    "menuItem1": {
        "description": "the first menu item",
        "locales": {
            "it": "Voce di menu 1",
            "en": "Menu Item 1"
        }
    },
    "menuItem2": {
        "description": "the second menu item",
        "locales": {
            "it": "Voce di menu 2",
            "en": "Menu Item 2"
        }
    }
}
```

and a starting directory structure like that:

```
Current Directory
├── _core.json
├── _menu.json
└── meta.json
```

then, to build the project, we have to type one of the following two forms:

```bash
$ chrome-i18n -f meta.json
$ chrome-i18n --file meta.json
```

and once hit the enter key and waited for a while, we should have something like
that:

```
Current Directory
├── _locales
│   ├── en
│   │   └── messages.json
│   └── it
│       └── messages.json
├── _core.json
├── _menu.json
└── meta.json
```

If something goes wrong, when the command exits a list of warnings and errors is
printed on the error console.


[cc-list]: https://developers.google.com/chrome/web-store/docs/i18n?hl=it#localeTable

