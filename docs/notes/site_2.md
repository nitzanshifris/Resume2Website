# The Way The Website Should Work

## 1. Initial State - Unregistered Users

All the un registerd user who enters the website should see the initial home page that shows the cv pile and the empty card next to the text. like you can see here - /Users/nitzan_shifris/Desktop/CV2WEB-V4/Screenshot 2025-09-10 at 14.48.51.png

## 2. File Upload Flow

### Upload Process
When non registered or signed up user is uploading a file through one of the three options (nav bar upload button , home page upload button , home page dropbox) . the file should first go through the validation we have in the code . if he doesnt pass , the user needs to see the right error that was raised . else , if the cv past the validation - the cv pile should be saved in the data bases connected to the user, and apear inside the cv pile card for 2 seconds as you can see here - /Users/nitzan_shifris/Desktop/CV2WEB-V4/Screenshot 2025-09-10 at 14.53.40.png . than we are presenting the user the cv process like you see here - /Users/nitzan_shifris/Desktop/CV2WEB-V4/Screenshot 2025-09-10 at 14.53.56.png . that needs to start the animation that - does a red cross on the "static resume" + openiinng the macbook component showing the video carousle and title, the text is changed to the vertical process bar ui component  ...

## 3. Authentication Flow

We give the user a moment to see this state than we split the next step for two options : 1- non registerd users should get the signup modal pop up .

### OAuth Login Options:
- mail , Google and LinkedIn login

after the user is signed up , the full process should start automaticly .2- already registerd users should automaticly have the full extraction and generation process . after registeration the process needs to be id to the signedup process .

## 4. Progress Bar Behavior

Before while the process (actual extradction) is running in the backend , the frontend vertical progress bar should show - 0% . after the process is began - the ui progress should increase in linear steps of 5% from 0% 70% . this full movment from 0 to 70 should take one minute . from 70% we want to make jumps of 1% each 6 seconds . which gives us full more minute before reaching 80% . 80% is the max value the progress bar should show . the progress bar should be connected to the actual progress just to insure the if the generation is completed before the bar reached 80% - the progress bar will fastly jump to 80% . or if the the ui progress bar getting closer to 80 before the generation is complete - the progress bar should delay more in 79% until the generation is complete .

## 5. Generation Complete

When the generation is complete - there is a component that pops up - telling the user that his portfolio is 80% ready ... allowing him to - click edit now button to go directly to dashboard . or click outside the component the go back to the home page . like you can see here - /Users/nitzan_shifris/Desktop/CV2WEB-V4/Screenshot 2025-09-10 at 15.07.58.png

## 6. Portfolio Ready State

When there is a portfolio ready connected to a user , the home page need to show a bigger version of the macbokk component with the template that was generated presented inside the mackbook . near the macbook there should be 3 buttons . like you can see here - /Users/nitzan_shifris/Desktop/CV2WEB-V4/Screenshot 2025-09-10 at 15.09.09.png .

- edit now - direct to dashboard
- ready to go - opens subscription embeded stripe compenent .
- get inspired - scrolls automaticly down to the next page in the website .

## 7. State Persistence

If a user is refreshing the website in this state - it should go back to same state .

## 8. Dashboard Changes

All the changes the user is doing inside the dashboard edit mode , should be saved and presented in the portfolio the user is seeing in the home page inside the macbook component .

## 9. Manual State

The manual state - if something happend durring the generation , like the user refreshed or go out of site or there is an error in the process - this state brings us to this state - the user already has an uploaded file the got through our validation but he doesnt have a valid portfolio to present . in this case we are ahowing the intinal state home page with two changes : 1- inside the cv pile card the user should already see the last uploaded cv file he uploaded in to the system . 2- the "start now" should appear - allowing the the user to manualy start the full animation and process . **this is the only state when the flow doesnt starts automaticly .

## 10. CV Management

Our system allow the user to save max 10 cv at the same time . and warn him when he want to add the 11 cv file that it will delete the first cv he uploaded .

If a user that already has a generated portfolio is uploading a new cv file - the system should warn him that this action will delete the previous portfolio he generated . if the user agree -the old porfolio is getting deleted , the website should automaticly refresh to the intinail home page . than the new cv file should automaticly appear inside the cv pile card and start the animation + progress automaticly , just like in the "first time" the user uploaded a file .

## 11. Logout/Login Behavior

If a user that already has a generated portfolio is logged out than back in - he need to see this state - /Users/nitzan_shifris/Desktop/CV2WEB-V4/Screenshot 2025-09-10 at 15.09.09.png . meaning the portfolio should restore for presentation .

If a user that already has a cv uploaded but doesnt have a valid portfolio to present is log out than back in - he should see this state the manual state . with the actual cv file presented in the cv pile card and the start now button visible .

## 12. Error States

Error States: all the errors that the user needs to see like ( worng file uploaded or anything else the user should see as an error) should use the same system and be connected to the backend logs but presented differently . not all backend logs errors should be visible to the user as error toasts .

When backend extraction fails - the user should get an error toast and get back in to the "manual state" , where can retry manualy the full process by pressing the start now button .

## 13. Payment & Deployment

Stripe payment is required - when user click the "Ready to go " button .

After payment - the user portfolio get deployed in vercel and the user is getting a custom domain for hes portfolio , based on his name and sub domaions .portfolios

We save the - Free preview portfolio for 1 month for the user to look ,edit and decide if is ready to subscript and deploy . after this we delete all generated portfolios in the user account .

## 14. Dashboard Auto-Save

For non subscripted user the edits are saved automaticly each time the user is moving from edit mode to previe mode in the dashboard, the portfolio files should be automaticly updated with the changes . when the user is going back from the dashboard to the home page ,the porfolio that is presented in the macbook should refresh to show all the changes he did in the edit mode . if it takes time , the user should see a "updating your portfolio" until the new presentation is ready . we dont want to regenerate ! just re fresh with the new edits and adds .

## 15. Mobile Experience

In the mobile experience there are some differences wich we should optimize later .