# mvw (model-view-web)

*A micro extension library for rapid development of simple and limited-scope web-based applications and tooling*

## The Docs

* Source: [https://github.com/DataDink/mvw](https://github.com/DataDink/mvw)
* Notes: [https://github.com/DataDink/mvw/wiki/Version-Notes](https://github.com/DataDink/mvw/wiki/Version-Notes)
* API: [https://github.com/DataDink/mvw/wiki/Documentation](https://github.com/DataDink/mvw/wiki/documentation)

## The Basics

> **The steps are few:**
>
> * **Decorate** the view with `bind-` attributes
> ```html
> <html>
>   <head>
>     <script src="mvw.js"></script>
>   </head>
>   <body>
>
>     <!-- binds the span's `textContent` property to the model's `strings.title` value -->
>     <span bind-textContent="strings.title"></span>
>
>   </body>
> </html>
> ```
> * **Bind** the document with the `.bind` extension, passing a model
> ```js
> // The model can be most any object
> let model = {
>   strings: {
>     title: 'The sample title',
>     description: 'A sample description'
>   }
> }
>
> // document is an ancestor of the element and can be used as the binding point
> document.bind(model);
> ```
> * **ReBind** to apply changes made to the model
> ```js
> model.strings.title = 'The title has been changed';
> document.bind(model);
> ```

## The Idea

> **Goal:**
> * Bridge **Application** & **Presentation**, unobtrusively and declaratively, without deviating from existing web *strategies* and *patterns*
>
> **Result:**
> * A micro, tiered, extension library with a light-weight, one-way binding function to connect model/view via declarative, attribute-driven view decoration.
>
> **Pros:**
> * Tiny
> * Clean
> * Declarative
> * Unopinionated
> * Customizable
> * Embraces/targets existing web patterns
> * Targets light projects (no overhead, quick startup)
>
> **Cons:**
> * Performance: Untested -> Enough for lightweight projects
> * Support: Maybe. This is an experiment. Feel free to make pull requests.
> * Breaking Changes: This project is currently young and undergoing breaking changes while core functionality is being flushed out.
>
> **Problem Being Solved:**
>
> *The only real missing piece to the DOM is a good method for declaratively binding it to a model*
> <img src="Problem.jpg" style="width: 50%;" />
>
> *Note: This came out unintentionally similar to vue, but differs in that it tries to keep/continue with existing web patterns and targets prototype extensions*

## Samples

> * [Calendar Designer](https://datadink.github.io/mvw/samples/CalendarDesigner.html) - Used by my local pub to print out their event calendars

## Quick Start

> **Sample Application**
>
> *A tiny application that adds template content to the page when a button is clicked*
>
> ```html
> <!DOCTYPE html>
> <html>
>   <head> <!-- mvw has different tiers for different needs. -->
>     <!--<script src="https://datadink.github.io/mvw/release/latest/mvw.minimal.min.js"></script>-->
>     <script src="https://datadink.github.io/mvw/release/latest/mvw.standard.min.js"></script>
>     <!--<script src="https://datadink.github.io/mvw/release/latest/mvw.extended.min.js"></script>-->
>   </head>
>   <body>
>     <header>
>
>       <!-- Binds `<h1>.textContent` to `model.strings.title` -->
>       <h1 bind-textContent="strings.title"></h1>
>
>     </header>
>     <main>
>
>       <!-- Binds the template to the `model.items` array -->
>       <template bind-template="items">
>
>         <!-- Binds the `<button>.onclick` event to the `item.removeItem` function -->
>         <!-- When clicked, the `item.removeItem` function will be passed
>              the button's `textContent` and its parent node's `tagName` -->
>         <button bind-onclick="removeItem(textContent, parentNode.tagName)">
>           Remove Item
>         </button>
>
>         <div>
>
>           <!-- Binds `<span>.textContent` to `item.time.created` -->
>           <p>This item was created at <span bind-textContent="time.created"></span></p>
>
>           <!-- Binds `<span>.textContent` to `item.time.added` -->
>           <p>This item was added at <span bind-textContent="time.added"></span></p>
>         </div>
>
>       </template>
>
>       <!-- Binds the `<button>.onclick` event to the `model.addItem` -->
>       <!-- When clicked, the `model.addItem` function will be passed the `ClickEvent` info -->
>       <button bind-onclick="addItem">Add Item</button>
>     </main>
>     <script>
>
>       /** @class {Application} - A simple application that binds a model when .publish is called */
>       class Application {
>
>         /** @property {function} publish - called when the model has changes */
>         publish;
>
>         /** @property {object} model - the application model that is published to the view */
>         model = { // Gets bound to document.body
>           strings: {
>             title: 'Sample Page', // Gets bound to html/body/header/h1.textContent
>             descriptions: '...'
>           },
>           items: [], // Gets bound to html/body/main/template
>           addItem: null // Gets bound to html/body/main/button.onclick
>         };
>
>         /** @property {function} addItem - call to add an item to the model */
>         addItem(buttonText) {
>           console.log(`${buttonText} clicked: removing from ${parent}`);
>           var item = new Item(this);
>           setTimeout(() => {
>             item.time.added = Date.now();
>             this.model.items.push(item);
>             this.publish();
>           },1000);
>         };
>
>         /** @constructor {Application} - configures the Application and its model */
>         constructor(publish) {
>           this.publish = () => publish(this.model);
>           this.model.addItem = e => this.addItem(e.target.textContent);
>           this.publish();
>         }
>       }
>
>       /** @class {Item} - created by the Application.prototype.addItem function */
>       class Item {
>
>         /** @property {Application} app - reference to the owner application */
>         app;
>
>         /** @property {string} time - some time stamps */
>         time = {
>           created: Date.now(), // Gets bound to html/body/main/template/span.textContent
>           added: null, // Gets bound to html/body/main/template/span.textContent
>         };
>
>         /** @property {function} removeItem - removes the item from its owner Application */
>         removeItem(buttonText, parentTag) { // Gets bound to html/body/main/template/button.onclick
>           console.log(`${buttonText} clicked: removing from ${parentTag}`);
>           let index = this.app.model.items.indexOf(this);
>           this.app.model.items.splice(index, 1);
>           this.app.publish();
>         }
>
>         /** @constructor {Item} - configures the Item with reference to the owner Application */
>         constructor(app) { this.app = app; }
>       }
>
>       /** @const {Application} App - an instance of Application configured to bind to document.body */
>       const App = new Application(model => document.body.bind(model));
>
>     </script>
>   </body>
> </html>
> ```
