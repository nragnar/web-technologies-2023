i.
Nicolas Ragnell
nicolas.ragnell@abo.fi

ii.
All requirements have been implemented
iii.
1. Start the virtual environment
2. Go to the folder web_technologies/backend and run "python manage.py runserver"
3. Open another terminal and go to the folder web_technologies/frontend and run "npm run dev"
4. Open the link provided by the frontend [vite]. Should be http://localhost:5173





Here are the project specifications for the course project:


# WebShop Web Application - Project Requirements

## Constraints
- **Project folder (MANDATORY):**
  - The root folder of the project should contain a `readme.md` file listing:
    i. Your name and email address
    ii. Which requirements optional requirements have been implemented
    iii. How to run the project (install dependencies, start server(s))
  - Root folder must contain `requirements.txt` for the backend
  - The frontend folder should contain the `package.json` file with all used packages
  - The frontend folder should include both `src` and `build` folders

- **Backend (Mandatory):**
  - Backend uses Django, and provides an API
  - Django serves JSON to the shop page and HTML to the landing page
  - We use SQLite database for this project.
  
  **NOTE:**
  - The project server is started with `python manage.py runserver` without the need to start another frontend server. (optional)

- **Frontend (MANDATORY):**
  - The web shop should be implemented as a single-page application (SPA) using React.
  - The web shop should be available at http://localhost:8080/

## Functional Requirements
- **Automatic DB population (MANDATORY):**
  - On the landing page (for grading purposes) there should be a link or button from where any anonymous visitor should be able to automatically populate the DB with 6 users, of which 3 users (i.e. sellers) own 10 items each. Before each re-population, the DB should be emptied. The generated users should have the following format:
    - Username: testuser#
    - Password: pass#
    - Email address: testuser#@shop.aa
  - After the data is generated the landing page should be updated with a message

- **Browse (MANDATORY):**
  - Any user can see the list of items for sale.
    - The item (graphical) component should have at least this information:
      i. Title
      ii. Description
      iii. Price
      iv. Date added

- **Search:**
  - Any user can search for items by title. Note: any search action should result in a request to the API.

- **Create an account (MANDATORY):**
  - Users should be able to create an account by setting a username, password, and email address. To make evaluation easier do not enable strong password authentication and do not check emails against regular expressions.

- **Login (MANDATORY):**
  - A registered user can login with a username and password

- **Add item (MANDATORY):**
  - An authenticated user can add a new item to sell by providing:
    a. Title
    b. Description
    c. Price
  - The date of creation should be automatically saved on the backend.

- **Add to cart (MANDATORY):**
  - An authenticated user can select an item for purchase by adding it to the cart. A user (buyer or seller) cannot add to the cart its own items. The item should still be available for other users to search for and add to their cart.

- **Remove from the cart:**
  - An item can be removed from the cart by the buyer.

- **Pay:**
  - The buyer sees the list of items to be purchased. When pressing the “PAY” button:
    - If the price of an item has changed for any item in the cart, the cart transaction is halted and
      i. a notification will be shown next to the item, and
      ii. the displayed price should be updated to the new price.
    - If an item is no longer available when the user clicks 'Pay', the whole cart transaction is halted and a notification is shown to the user without removing the item from the cart. The user can manually remove the unavailable items and then Pay.
    - On a successful Pay transaction, the status of each item in the cart becomes SOLD. The bought items are listed as the buyer’s item (but they are not available for sale).

- **Routing:**
  - The Shop page should be implemented as a SPA. One should be able to navigate from the browser (bar) to the following links:
    a. Shop “/”
    b. SignUp “/signup”
    c. Login “/login”
    d. Edit Account “/account”
    e. My Items: “/myitems”

- **Edit Account:**
  - An authenticated user should be able to change the password of the account by providing the old and then new password.

- **Display inventory:**
  - An authenticated user should be able to visualize his/her own items: on sale, sold, and purchased.

- **Edit item:**
  - The seller of an item can edit the price of the item as long as the item is on sale (available), via the Edit button, regardless of the item being added to any other buyers’ carts.

## Non-Functional - Look and feel
- The web pages should look nice and easy to use on regular desktop screens.
