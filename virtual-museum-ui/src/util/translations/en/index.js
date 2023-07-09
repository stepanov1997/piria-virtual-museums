const homeScreen = {
    news: 'News',
    museums: 'Museums',
    presentation: 'Presentation',
    welcome: 'Welcome to Virtual Museum',
    introText: 'Here you can buy ticket for virtual visit for one of more than 50 museums. You will receive your ticket on email. Lets dive into:',
    introTextShorter: 'Lets dive into:'
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
    languageSelectorTitle: "Select language:"
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
    registerButtonTitle: 'Register'
}

const registration = {
    firstNameErrorMessage: "First name must have value.",
    lastNameErrorMessage: "Last name must have value.",
    usernameErrorMessage: "Username must have value.",
    passwordErrorMessage: "Password must have value.",
    emailErrorMessage: "Email must have value.",
    passwordConfirmationErrorMessage: "Confirmation of password should be valid.",
    registrationTitle: 'Input data for registration',
    registerButtonTitle: 'Register',
    emailPlaceholder: 'Enter email',
    passwordAgainPlaceholder: 'Confirm password',
    passwordPlaceholder: 'Enter password',
    usernamePlaceholder: 'Enter username',
    lastNamePlaceholder: 'Enter last name',
    firstNamePlaceholder: 'Enter first name'
}

export default {homeScreen, ticketPaymentForm, customDatePicker, customTimePicker,
    museumComponent, newsPostsList, virtualVisitForm, adminHomeFeed, museumAdministration,
    languageSelector, watchPresentationForm, userAdministration, museumsFeedComponent, login, registration
}