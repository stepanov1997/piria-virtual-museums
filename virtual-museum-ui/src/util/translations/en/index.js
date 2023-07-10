const app = {
    Login: "Login",
    Registration: "Registration",
    MuseumsFeed: "Museum feed",
    Home: "Home",
    Presentation: "Presentation",
    Museums: "Available museums",
    Museum: "Museum info",
    News: "News",
    AdminScreen: "Admin home",
    CreateMuseumScreen: "Add museum",
    StatisticsScreen: "Statistics",
    UserAccountScreen: "User accounting",
    LanguageSelector: "Change language"
}

const chart = {
    chartTitle: "Number of active users by hour."
}

const homeScreen = {
    news: 'News',
    museums: 'Museums',
    presentation: 'Presentation',
    languageSelector: 'Change language',
    welcome: 'Welcome to Virtual Museum',
    introText: 'Here you can buy ticket for virtual visit for one of more than 50 museums. You will receive your ticket on email. Lets dive into:',
    introTextShorter: 'Lets dive into:',
    statistics: 'Statistics',
    createMuseum: 'Create museum',
    downloadLogsText: 'Download logs',
    userAccount: 'User accounting',
    errorSavingFileMessage: 'Error saving file!'
}
const ticketPaymentForm = {
    cardHolderFirstNamePlaceholder: "Card Holder First Name",
    cardHolderSurNamePlaceholder: "Card Holder Surname",
    cardNumberPlaceholder: "Card Number",
    cardTypePlaceholder: "Select Card Type...",
    expirationMonthPlaceholder: "Enter expiration month.",
    expirationYearPlaceholder: "Enter expiration year.",
    pinPlaceholder: "Enter PIN.",
    submitButtonTitle: "Submit",
}

const customDatePicker = {
    yearPickerPlaceholder: "Select year:",
    monthPickerPlaceholder: "Select month:",
    dayPickerPlaceholder: "Select day:",
}

const customTimePicker = {
    hourPickerPlaceholder: "Select hour:",
    minutePickerPlaceholder: "Select minute:"
}

const languageSelector = {
    en: "English",
    sr: "Serbian",
    languageSelectorTitle: "Select language:",
    changeLanguageAlert: "To change a language you should login again."
}

const museumComponent = {
    detailsLanguage: "english",
    datetimeLabel: "Datetime",
    durationLabel: "duration",
    priceLabel: "price",
    buyTicketButtonTitle: "Buy ticket",
    weatherTitle: "Weather",
    addressLabel: "Adress",
    phoneNumberLabel: "Phone number",
    cityLabel: "City",
    coordinatesLabel: "Coordinates",
    typeLabel: "Type",
    detailsLabel: "Details",
    hideText: "Hide",
    showText: "Show",
    virtualVisitsText: "virtual visits"
}

const newsPostsList = {
    titleLabel: 'Title',
    linkLabel: 'Link',
    descriptionLabel: 'Description',
    pubDateLabel: 'Pub date',
    contentLabel: 'Content'
}

const virtualVisitForm = {
    museumPickerPlaceholder: "Select museum",
    pricePlaceholder: "Enter price",
    durationPlaceholder: "Enter duration",
    imagePickerPlaceholder: "Pick an image from camera roll",
    youtubeLinkPlaceholder: "Youtube link",
    addVirtualVisitButtonTitle: "Add virtual visit"
}

const watchPresentationForm = {
    sessionIsOverAlert: "Session is over.",
    presentationStartingLabel: "Presentation is starting in",
    minutes: 'minute(s)',
    seconds: 'second(s)',
    countryLabel: 'Country',
    cityLabel: 'City',
    typeLabel: 'Type',
    datetimeLabel: 'Datetime',
    durationLabel: 'Duration',
    watchVirtualPresentationTitle: 'Watch virtual presentation',
    watchVirtualPresentationPlaceholder: 'Enter virtual visit ticket id',
    watchPresentationButtonTitle: "Watch presentation"
}

const adminHomeFeed = {
    numberOfRegisteredUsersLabel: 'Number of registered users',
    numberOfActiveUsersLabel: 'Number of active users',
    errorMessage: 'Some error happened!'
}

const museumAdministration = {
    museumNamePlaceholder: 'Enter museum name',
    museumAddressPlaceholder: 'Enter museum address',
    museumCountryPickerPlaceholder: 'Select museum country',
    museumCityPickerPlaceholder: 'Select museum city',
    museumLatitudePlaceholder: 'Enter museum latitude',
    museumLongitudePlaceholder: 'Enter museum longitude',
    museumPhoneNumberPlaceholder: 'Enter museum phone number',
    museumTypePlaceholder: 'Enter museum type',
    addMuseumButtonTitle: 'Add museum'
}

const userAdministration = {
    usernameHeaderRow: 'Username',
    approveUserRegistrationHeaderRow: 'Approve registration',
    blockUserHeaderRow: 'Block user',
    resetPasswordHeaderRow: 'Reset password',
    approveRegistrationButtonTitle: 'APPROVE',
    blockUserButtonTitle: 'BLOCK',
    resetPasswordButtonTitle: 'RESET'
}

const museumsFeedComponent = {
    availableMuseumsTitle: 'Available museums',
    searchByNamePlaceholder: 'Search museums by name',
    searchByCityPlaceholder: 'Search museums by city',
    searchMuseumsButtonTitle: 'Search',
    openMuseumLinkTitle: 'Explore now',
    noDataText: 'No data'
}

const login = {
    loginErrorMessage: 'Username or password must have value.',
    welcomeMessage: 'Welcome to Virtual Museum!',
    usernameInputPlaceholder: 'Enter username',
    passwordInputPlaceholder: 'Enter password',
    loginButtonTitle: 'Log in',
    dontHaveAccountQuestion: 'Don\'t have an account?',
    registerButtonTitle: 'Register',
    errorMessage: 'Some error happened!'
}

const registration = {
    firstNameErrorMessage: "First name must have value.",
    lastNameErrorMessage: "Last name must have value.",
    usernameErrorMessage: "Username must have value.",
    passwordErrorMessage: "Password must have value.",
    emailErrorMessage: "Email must have value.",
    passwordConfirmationErrorMessage: "Confirmation of password should be valid.",
    usernameValidationMessage: "Username must have a minimum of 12 characters and cannot contain @, # or /.",
    passwordValidationMessage: "Password must have a minimum of 15 characters, including uppercase letters, lowercase letters, and numbers.",
    registrationTitle: 'Input data for registration',
    registerButtonTitle: 'Register',
    emailPlaceholder: 'Enter email',
    passwordAgainPlaceholder: 'Confirm password',
    passwordPlaceholder: 'Enter password',
    usernamePlaceholder: 'Enter username',
    lastNamePlaceholder: 'Enter last name',
    firstNamePlaceholder: 'Enter first name',
    successMessage: 'Successful registration'
}

export default {app, homeScreen, ticketPaymentForm, customDatePicker, customTimePicker,
    museumComponent, newsPostsList, virtualVisitForm, adminHomeFeed, museumAdministration, chart,
    languageSelector, watchPresentationForm, userAdministration, museumsFeedComponent, login, registration
}