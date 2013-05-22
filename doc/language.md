# Language Mode

* [Description](#description)
* [File format](#file-format)
    * [Meta descriptor file](#meta-descriptor-file)
    * [Definitions file set](#definitions-file-set)
* [Example](#example)


## Description

The **language** mode is usually used for big size projects, where the amount
of supported languages is so high to make it really harder to manage them only
by grouping by categories.


## File format

This mode requires the project to be splitted in more than one component:

- a **meta descriptor file**: this file replicates all the fields used in `meta`
  descriptor for the category mode and describe which files will go to compose
  the final project, and the database structure.
- a **definitions** file set: this is a set of smaller files, one for each 
  supported language by your application.

### Meta descriptor file

This file **must be** in a valid and well-formed JSON format. The following is 
the template structure:

```json
{
    "format": "language",
    "imports": "./db/",
    "dest": "./_locales/",
    "locales": [ "it", "en" ],
    "definitions": {
        "term1": {
            "description": "this is the term number 1"
        },
        "termNo": {
            "description": "this is the term number #",
            "placeholders": {
                "index": {
                    "content": "$1",
                    "example": "this is the term number 5"
                }
            }
        }
    }
}
```

In language mode, the `meta` descriptor is a single file, similiar to the `meta`
descriptor we found in [category](category.md#meta-descriptor-file) mode.
It requires only five fields to be defined:

<table>
<thead>
    <tr>
        <th>Field</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>format</td>
        <td>`String`</td>
        <td>it **must** be set to `language`.</td>
    </tr>
    <tr>
        <td>imports</td>
        <td>`String`</td>
        <td>it **must** be set to a path. No globs into the path are 
            allowed. This field indicates where to look for all the definition 
            files to be used to retrieve the required informations.
            <br><br>
            This field is validated and expanded according to some assumptions:
            <br><br>
            <ol>
                <li>if `format` is equal to `monolith`, then it will be ignored</li>
                <li>if not a `String`, it will be invalid</li>
                <li>if a `String` and no trailing path separator, it's invalid</li>
                <li>if a `String` with a trailing path separator, then it's a directory</li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>dest</td>
        <td>`String`</td>
        <td>it **must** be set to the target directory where the project have 
            to be built. The path **must** end with a trailing path separator 
            or the field will be invalid.</td>
    </tr>
    <tr>
        <td>locales</td>
        <td>`Array`</td>
        <td>supported country codes by your extension/application. They 
            **must** be compliant to the [country codes][cc-list] supported by 
            the Chrome Store.</td>
    </tr>
    <tr>
        <td>definitions</td>
        <td>`Object`</td>
        <td>this is pretty similiar to the one defined for the `database` field 
            in [monolith](doc/monolith.md#database-descriptor) mode, with a big 
            difference, there's not `locales` field defined in it.</td>
    </tr>
</tbody>
</table>

In this mode, no other fields are required. However, there's no restrictions to
the amount of informations you can add to this descriptor. Important is that the
informations you add don't go to conflict with the supported ones.

For example, you could add some copyright informations:

```json
{
    "name": "Just an example",
    "author": "Me and myself",
    "format": "language",
    "imports": "./db/",
    "dest": "./_locales/",
    "locales": [ "it", "en" ],
    "definitions": {
        "term1": { ... },
        "term2": { ... }
    }
}
```

and this would be perfectly valid.

### Definitions file set

The file **must be** a valid and well-formed JSON format. The following is the 
template structure:

```json
{
    "term1": "this is the term number 1",
    "termNo": "this is the term number $index$",
    .
    .
    .
}
```

It allows to split translations grouping them by language in smaller files easier
to manage. Here the structure is separated from the pure translation. All the 
files **must be** named using the appropriated country-code followed by **.json**
suffix and reside under the `imports` path (no subdirectories are allowed).

The keys defined in this JSON object simply refers to the keys defined into the 
meta descriptor file, and their values are the translation into the specified 
language.


## EXAMPLE

This is the category example adapted for this mode.

Here we need to split the project, so we have a meta file named (for
example) **meta.json** with the following structure:

```json
{
    "format": "language",
    "imports": "./langdb/",
    "dest": "./_locales/",
    "locales": [ "it", "en" ],
    "definitions": {
        "appTitle": {
            "description": "the app title"
        },
        "appDescription": {
            "description": "the description for the app store",
            "placeholders": {
                "index": {
                    "content": "$1",
                    "example": "This is the app number 4 developed by me"
                }
            }
        },
        "menuTitle": {
            "description": "the menu title"
        },
        "menuItem1": {
            "description": "the first menu item"
        },
        "menuItem2": {
            "description": "the second menu item"
        }
    }
}
```

and two definition files named respectively **it.json** and
**en.json**, under the **langdb/** directory.

The **it.json** file:

```json
{
    "appTitle": "La mia prima app tradotta",
    "appDescription": "Questa è la app numero $index$ sviluppata da me",
    "menuTitle": "Menu Principale",
    "menuItem1": "Voce di menu 1",
    "menuItem2": "Voce di menu 2"
}
```

The **en.json** file:

```json
{
    "appTitle": "My First Translated App",
    "appDescription": "This is the app number $index$ developed by me",
    "menuTitle": "Main Menu",
    "menuItem1": "Menu Item 1",
    "menuItem2": "Menu Item 2"
}
```

and a starting directory structure like that:

```
Current Directory
├── langdb
│   ├── en.json
│   └── it.json
└── meta.json
```

then, to build the project, we have to type one of these two forms:

```bash
$ chrome-i18n -f meta.json
$ chrome-i18n --file meta.json
```

and once hit the enter key and waited for a while, we should have something like
that:

```
Current Directory
├── langdb
│   ├── en.json
│   └── it.json
├── _locales
│   ├── en
│   │   └── messages.json
│   └── it
│       └── messages.json
└── meta.json
```

If something goes wrong, when the command exits, a list of warnings and errors is
printed on the error console.


[cc-list]:  https://developers.google.com/chrome/web-store/docs/i18n?hl=it#localeTable
