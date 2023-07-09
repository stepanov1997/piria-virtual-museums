const app = {
    Login: "Prijava",
    Registration: "Registracija",
    MuseumsFeed: "Izložba muzeja",
    Home: "Pocetna strana",
    Presentation: "Prezentacija",
    Museums: "Dostupni muzeji",
    Museum: "Informacije o muzeju",
    News: "Novosti",
    AdminScreen: "Početna strana administratora",
    CreateMuseumScreen: "Dodaj muzej",
    StatisticsScreen: "Statistike",
    UserAccountScreen: "Upravljanje korisničkim nalozima",
    LanguageSelector: "Promjeni jezik"
}

const chart = {
    chartTitle: "Broj aktivnih korisnika po satu."
}

const homeScreen = {
    news: 'Novosti',
    museums: 'Muzeji',
    presentation: 'Prezentacija',
    languageSelector: 'Promjeni jezik',
    welcome: 'Dobrodošli u Virtuelni Muzej',
    introText: 'Ovdje možete kupiti kartu za virtuelnu posjetu jednom od preko 50 muzeja. Kartu ćete dobiti putem e-maila. Hajde da zaronimo:',
    introTextShorter: 'Hajde da zaronimo:',
    statistics: 'Statistike',
    createMuseum: 'Dodaj muzej',
    userAccount: 'Korisnički nalozi'
}

const ticketPaymentForm = {
    cardHolderFirstNamePlaceholder: "Unesi ime vlasnika kartice",
    cardHolderSurNamePlaceholder: "Unesi prezime vlasnika kartice",
    cardNumberPlaceholder: "Unesi broj kartice",
    cardTypePlaceholder: "Izaberi tip kartice.",
    expirationMonthPlaceholder: "Unesi mjesec isteka.",
    expirationYearPlaceholder: "Unesi godinu isteka.",
    pinPlaceholder: "Unesi PIN.",
    submitButtonTitle: "Potvrdi",
}

const customDatePicker = {
    yearPickerPlaceholder: "Izaberite godinu:",
    monthPickerPlaceholder: "Izaberite mjesec:",
    dayPickerPlaceholder: "Izaberite dan:",
}

const customTimePicker = {
    hourPickerPlaceholder: "Izaberite sat:",
    minutePickerPlaceholder: "Izaberite minut:"
}

const languageSelector = {
    en: "Engleski",
    sr: "Srpski",
    languageSelectorTitle: "Izaberite jezik:",
    changeLanguageAlert: "Da biste promjenili jezik, morate se ponovo prijaviti."
}

const museumComponent = {
    detailsLanguage: "serbian",
    datetimeLabel: "Datum i vreme",
    durationLabel: "Trajanje",
    priceLabel: "Cena",
    buyTicketButtonTitle: "Kupi kartu",
    weatherTitle: "Vrijeme",
    addressLabel: "Adresa",
    phoneNumberLabel: "Broj telefona",
    cityLabel: "Grad",
    coordinatesLabel: "Koordinate",
    typeLabel: "Tip",
    detailsLabel: "Detalji",
    hideText: "Sakrij",
    showText: "Prikaži",
    virtualVisitsText: "virtuelne posjete"
}

const newsPostsList = {
    titleLabel: 'Naslov',
    linkLabel: 'Veza',
    descriptionLabel: 'Opis',
    pubDateLabel: 'Datum objavljivanja',
    contentLabel: 'Sadržaj'
}

const virtualVisitForm = {
    museumPickerPlaceholder: "Izaberi muzej",
    pricePlaceholder: "Unesi cijenu",
    durationPlaceholder: "Unesi trajanje",
    imagePickerPlaceholder: "Izaberi sliku iz galerije",
    youtubeLinkPlaceholder: "Unesi Youtube vezu",
    addVirtualVisitButtonTitle: "Dodaj virtuelnu posetu"
}

const watchPresentationForm = {
    sessionIsOverAlert: "Sesija je završena.",
    presentationStartingLabel: "Prezentacija počinje za",
    minutes: 'minut(a)',
    seconds: 'sekund(a)',
    countryLabel: 'Država',
    cityLabel: 'Grad',
    typeLabel: 'Tip',
    datetimeLabel: 'Datum i vrijeme',
    durationLabel: 'Trajanje',
    watchVirtualPresentationTitle: 'Pogledaj virtuelnu prezentaciju',
    watchVirtualPresentationPlaceholder: 'Unesite ID virtuelne posjete',
    watchPresentationButtonTitle: "Pogledaj prezentaciju"
}

const adminHomeFeed = {
    numberOfRegisteredUsersLabel: 'Trenutni broj registrovanih korisnika',
    numberOfActiveUsersLabel: 'Trenutni broj aktivnih korisnika',
}

const museumAdministration = {
    museumNamePlaceholder: 'Unesite naziv muzeja',
    museumAddressPlaceholder: 'Unesite adresu muzeja',
    museumCountryPickerPlaceholder: 'Izaberite državu muzeja',
    museumCityPickerPlaceholder: 'Izaberite grad muzeja',
    museumLatitudePlaceholder: 'Unesite geografsku širinu muzeja',
    museumLongitudePlaceholder: 'Unesite geografsku dužinu muzeja',
    museumPhoneNumberPlaceholder: 'Unesite broj telefona muzeja',
    museumTypePlaceholder: 'Unesite tip muzeja',
    addMuseumButtonTitle: 'Dodaj muzej'
}

const userAdministration = {
    usernameHeaderRow: 'Korisničko ime',
    approveUserRegistrationHeaderRow: 'Odobri registraciju',
    blockUserHeaderRow: 'Blokiraj korisnika',
    resetPasswordHeaderRow: 'Resetuj lozinku',
    approveRegistrationButtonTitle: 'ODOBRI',
    blockUserButtonTitle: 'BLOKIRAJ',
    resetPasswordButtonTitle: 'RESETUJ'
}

const museumsFeedComponent = {
    availableMuseumsTitle: 'Dostupni muzeji',
    searchByNamePlaceholder: 'Pretraži muzeje po imenu',
    searchByCityPlaceholder: 'Pretraži muzeje po gradu',
    searchMuseumsButtonTitle: 'Pretraži',
    openMuseumLinkTitle: 'Istraži sada',
    noDataText: 'Nema podataka'
}

const login = {
    loginErrorMessage: 'Korisničko ime ili lozinka moraju imati vrijednost.',
    welcomeMessage: 'Dobrodošli u Virtuelni muzej!',
    usernameInputPlaceholder: 'Unesite korisničko ime',
    passwordInputPlaceholder: 'Unesite lozinku',
    loginButtonTitle: 'Prijavi se',
    dontHaveAccountQuestion: 'Nemate nalog?',
    registerButtonTitle: 'Registruj se'
}

const registration = {
    firstNameErrorMessage: "Ime mora imati vrijednost.",
    lastNameErrorMessage: "Prezime mora imati vrijednost.",
    usernameErrorMessage: "Korisničko ime mora imati vrijednost.",
    passwordErrorMessage: "Lozinka mora imati vrijednost.",
    emailErrorMessage: "Email mora imati vrijednost.",
    passwordConfirmationErrorMessage: "Potvrda lozinke mora biti validna.",
    registrationTitle: 'Unesite podatke za registraciju',
    registerButtonTitle: 'Registruj se',
    emailPlaceholder: 'Unesite email',
    passwordAgainPlaceholder: 'Potvrdite lozinku',
    passwordPlaceholder: 'Unesite lozinku',
    usernamePlaceholder: 'Unesite korisničko ime',
    lastNamePlaceholder: 'Unesite prezime',
    firstNamePlaceholder: 'Unesite ime'
}

export default {
    app, homeScreen, ticketPaymentForm, customDatePicker,
    customTimePicker, languageSelector, museumComponent, newsPostsList, virtualVisitForm,
    watchPresentationForm, adminHomeFeed, museumAdministration, userAdministration, museumsFeedComponent,
    login, registration, chart
}