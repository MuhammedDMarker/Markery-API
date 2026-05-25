# Crafttale (Markery) APIs and Methods Documentation
Using Custom NPCs scripting for ECMAScript (Also known as JavaScript) and so
to be able to create or control that requires a lot of work and undertanding.

The stuff you need to know before start scripting:
The Javascript that's working from Custom NPCs is working through Nashorn Engine.
Nashorn Engine is like a bridge between Java classes and Javascript coding. You
can access and use classes that been loaded and use it methods for your purposes.
Markery APIs is custom methods that been using classes from mods or even Java
itself. Though, it's always required to understand those methods and what they
can do before using them in any server. **And you need to insert the Scripts**
**folder with all it contain.** It's the primary library for Markery methods.

# Using The Methods and how to setup the library
Markery Library is only available for **Crafftale** server. It's not public to
all Scripters yet. There will be soon a different version for it but not decided
yet.

For **Crafttale** Team, The library already there in the *Custom NPCs* Folder.
*Custom NPCs* folder is in the same directory of world, config, etc. **It's Highly**
**recommanded not to touch anything without approve!** If you're confused about something
talk with MR Edip (Marker) for details or support.

**To use the method** you need to import the API wrapper of Custom NPCs (or use it through
the Custom NPCs event) to get the API of custom NPCs. Then using the API get the
global Directory (The folder that has Scripts library. Not the world one) and then from
there you can load the method script to use the methods it contain. Here's an example
for importing APIs methods:

```var FileImport = Java.type("java.io.File"); //Java file class
var FilesImport = Java.type("java.nio.file.Files"); //Java files class
var PathsImport = Java.type("java.nio.file.Paths"); //Java paths class

var WrapperNpcAPI = Java.type("noppes.npcs.api.wrapper.WrapperNpcAPI");
var API = WrapperNpcAPI.Instance();

load(new FileImport(new FileImport(new FileImport(API.getGlobalDir(),"Scripts"),"APIs"),"APIs.js")); //API's file load```

