const contacts = [
    {
        name: 'John Doe',
        phones: [
            { number: '123-456-7890', type: 'mobile', isPrimary: true },
            { number: '098-765-4321', type: 'home', isPrimary: false }
        ]
    },
    {
        name: 'Jane Smith',
        phones: [
            { number: '555-555-5555', type: 'work', isPrimary: true }
        ]
    }
];

// Валідація імені контакту
function validateContactName(name) {

    const result = {
        isValid: true,
        message: ''
    }

    // Check if the name is empty
    if (!name || name.trim() === '') {
        result.isValid = false;
        result.message = 'Name cannot be empty';
        return result;
    }

    // Max 10 characters
    if (name.length > 10) {
        result.isValid = false;
        result.message = 'Name cannot be longer than 10 characters';
        return result;
    }

    // Min 2 characters
    if (name.length < 2) {
        result.isValid = false;
        result.message = 'Name cannot be shorter than 2 characters';
        return result;
    }

    // Forbidden characters: !@#$%^&*()_+={}[]|\:;"'<>,.?/~`
    const forbiddenChars = /[!@#$%^&*()_+={}[\]|\\:;"'<>,.?/~`]/;
    if (forbiddenChars.test(name)) {
        result.isValid = false;
        result.message = 'Name cannot contain special characters';
        return result;
    }

    return result;
}

// Валідація номера телефону
function validatePhoneNumber(phoneNumber) {
    const result = {
        isValid: true,
        message: ''
    }

    // Check if the phone number is empty
    if (!phoneNumber || phoneNumber.trim() === '') {
        result.isValid = false;
        result.message = 'Phone number cannot be empty';
        return result;
    }

    // Check if the phone number is valid (only digits, spaces, dashes, parentheses)
    const phoneRegex = /^[0-9\s\-()]+$/;
    if (!phoneRegex.test(phoneNumber)) {
        result.isValid = false;
        result.message = 'Phone number can only contain digits, spaces, dashes, and parentheses';
        return result;
    }

    return result;
}

// Перевірка валідності даних форми
function isFormValid(name, email, phones, date) {
    return validateContactName(name).isValid && validateEmail(email).isValid && phones.every(phone => validatePhoneNumber(phone.number).isValid) && validateDate(date).isValid;
}

function hideButton(button) {
    button.classList.add('hidden');
}

function showButton(button) {
    button.classList.remove('hidden');
}

function validateDate(value) {
    const result = {
        isValid: true,
        message: ''
    }
    if(!value) {
        result.isValid = false;
        result.message = 'Date is required';
        return result;
    }

    const date = new Date(value);
    if(isNaN(date) || date.getFullYear() < 1900 || date > new Date()) {
        result.isValid = false;
        result.message = 'Date must be between 1900 and the current date';
    }
    return result;
}

function validateEmail(value) {
    const result = {
        isValid: true,
        message: ''
    };

    if (!value || value.trim() === '') {
        result.isValid = false;
        result.message = 'Email cannot be empty';
        return result;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(value.trim())) {
        result.isValid = false;
        result.message = 'Invalid email format';
        return result;
    }

    return result;
}

function createAddForm() {
    console.log('Creating add form...');
    hideButton(document.querySelector('#add-item'));

    const form = document.createElement('form');

    // Поле для введення імені контакту
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'item';
    input.placeholder = 'Enter name';
    form.appendChild(input);

    const emailBlock = document.createElement('div');
    form.appendChild(emailBlock);
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.placeholder = 'Enter email';
    emailBlock.appendChild(emailInput);
    
    // Валідація форми при введенні даних
    form.addEventListener('input', function () {
        const nameValidation = validateContactName(input.value);
        const emailValidation = validateEmail(emailInput.value);
        const phoneInputs = form.querySelectorAll('input[name="phone"]');
        const dateValidation = validateDate(dateInput.value);
        const phones = Array.from(phoneInputs).map(phoneInput => ({number: phoneInput.value}));
        const formIsValid = isFormValid(input.value, emailInput.value, phones, dateInput.value);
        form.querySelector('button[type="submit"]').disabled = !formIsValid;

        input.classList.remove('error', 'valid');
        if (!nameValidation.isValid) {
            input.classList.add('error');
        } else {
            input.classList.add('valid');
        }

        emailInput.classList.remove('error', 'valid');
        if (!emailValidation.isValid) {
            emailInput.classList.add('error');
        } else {
            emailInput.classList.add('valid');
        }

        dateInput.classList.remove('error', 'valid');
        if (!dateValidation.isValid) {
            dateInput.classList.add('error');
        } else {
            dateInput.classList.add('valid');
        }

        Array.from(phoneInputs).forEach(phoneInput => {
            const phoneValidation = validatePhoneNumber(phoneInput.value);
            phoneInput.classList.remove('error', 'valid');
            if (!phoneValidation.isValid) {
                phoneInput.classList.add('error');
            } else {
                phoneInput.classList.add('valid');
            }
        });
    });

    const nameError = document.createElement('div');
    nameError.classList.add('error-message');
    form.appendChild(nameError);

    input.addEventListener('input', function () {
        const nameValidation = validateContactName(input.value);
        if (!nameValidation.isValid) {
            nameError.textContent = nameValidation.message;
        } else {
            nameError.textContent = '';
        }
    });

    const phonesBlock = document.createElement('div');
    form.appendChild(phonesBlock);

    const firstPhoneBlock = createPhoneInputBlock('', 'mobile', true);
    phonesBlock.appendChild(firstPhoneBlock);

    // add another phone number button
    const addPhoneButton = document.createElement('button');
    addPhoneButton.type = 'button';
    addPhoneButton.classList.add('add-phone-button');
    addPhoneButton.textContent = 'Add another phone number';
    addPhoneButton.addEventListener('click', function () {
        const newPhoneBlock = createPhoneInputBlock('', 'mobile', false);
        phonesBlock.insertBefore(newPhoneBlock, addPhoneButton);
    });

    phonesBlock.appendChild(addPhoneButton);

    const dateBlock = document.createElement('div');
    dateBlock.style.display = 'flex';
    dateBlock.style.flexDirection = 'row';
    dateBlock.style.gap = '10px';
    form.appendChild(dateBlock);

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateBlock.appendChild(dateInput);

    const dateError = document.createElement('div');
    dateError.classList.add('error-message');
    dateBlock.appendChild(dateError);

    dateInput.addEventListener('input', function () {
        const v = validateDate(dateInput.value);
        dateError.textContent = v.isValid ? '' : v.message;
    });

    const formContainer = document.querySelector('#add-form-container');

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function () {

        form.parentNode.removeChild(form);
        showButton(document.querySelector('#add-item'));
    });
    form.appendChild(cancelButton);


    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';

    submitButton.disabled = true;
    form.appendChild(submitButton);


    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        const name = formData.get('item');
        const email = formData.get('email');
        const phones = [];
        const phoneInputs = form.querySelectorAll('input[name="phone"]');
        const phoneTypeSelects = form.querySelectorAll('select[name="phone-type"]');
        const primaryRadios = form.querySelectorAll('input[name="primary-phone"]');
        const dateInput = form.querySelector('input[type="date"]');

        phoneInputs.forEach((phoneInput, index) => {
            const phoneNumber = phoneInput.value;
            const phoneType = phoneTypeSelects[index].value;
            const isPrimary = primaryRadios[index].checked;
            if (phoneNumber) {
                phones.push({number: phoneNumber, type: phoneType, isPrimary: isPrimary});
            }
        });

        contacts.push({name: name, phones: phones, date: dateInput.value, email: email});
        updateContactList();
        formContainer.removeChild(form);
        showButton(document.querySelector('#add-item'));

    });


    formContainer.appendChild(form);
}

function createPhoneInputBlock(phoneNumber, phoneType, isPrimary) {
    const phoneInputBlock = document.createElement('div');
    phoneInputBlock.style.display = 'flex';

    // Phone
    const phoneInput = document.createElement('input');
    phoneInput.type = 'text';
    phoneInput.name = 'phone';
    phoneInput.placeholder = 'Enter phone number';
    phoneInput.value = phoneNumber;
    phoneInputBlock.appendChild(phoneInput);

    // Phone type (mobile, home, work)
    const phoneTypeSelect = document.createElement('select');
    phoneTypeSelect.name = 'phone-type';
    const phoneTypes = ['Mobile', 'Home', 'Work'];
    phoneTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.toLowerCase();
        option.textContent = type;
        if (type.toLowerCase() === phoneType) {
            option.selected = true;
        }
        phoneTypeSelect.appendChild(option);
    });
    phoneInputBlock.appendChild(phoneTypeSelect);

    // Priority select (radio buttons) - if several phone numbers are added, the user can select which one is the primary contact number
    const primaryRadio = document.createElement('input');
    primaryRadio.type = 'radio';
    primaryRadio.name = 'primary-phone';
    primaryRadio.value = `phone-${phoneNumber}`;
    if (isPrimary) {
        primaryRadio.checked = true;
    }
    phoneInputBlock.appendChild(primaryRadio);

    const phoneError = document.createElement('div');
    phoneError.classList.add('error-message');
    phoneInputBlock.appendChild(phoneError);

    phoneInput.addEventListener('input', function () {
        const phoneValidation = validatePhoneNumber(phoneInput.value);
        if (!phoneValidation.isValid) {
            phoneError.textContent = phoneValidation.message;
        } else {
            phoneError.textContent = '';
        }
    });

    const removePhoneButton = document.createElement('button');
    removePhoneButton.type = 'button';
    removePhoneButton.textContent = 'Remove';
    removePhoneButton.addEventListener('click', function () {
        phoneInputBlock.parentNode.removeChild(phoneInputBlock);
    });
    phoneInputBlock.appendChild(removePhoneButton);


    return phoneInputBlock;
}


document.querySelector('#add-item').addEventListener('click', function (event) {
    event.preventDefault();
    createAddForm();
});


function updateContactList() {
    const contactList = document.querySelector('#contacts-container');
    contactList.innerHTML = '';

    // create table
    const table = document.createElement('table');
    table.id = 'contact-list';

    //create table header
    const headerRow = document.createElement('tr');
    const nameHeader = document.createElement('th');
    nameHeader.textContent = 'Name';
    headerRow.appendChild(nameHeader);
    const emailHeader = document.createElement('th');
    emailHeader.textContent = 'Email';
    headerRow.appendChild(emailHeader);
    const phoneHeader = document.createElement('th');
    phoneHeader.textContent = 'Phones';
    headerRow.appendChild(phoneHeader);
    const dateHeader = document.createElement('th');
    dateHeader.textContent = 'Date';
    headerRow.appendChild(dateHeader);
    table.appendChild(headerRow);

    contactList.appendChild(table);

    contacts.forEach((contact) => {
        const row = document.createElement('tr');

        // Name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = contact.name;
        row.appendChild(nameCell);

        // Email cell
        const emailCell = document.createElement('td');
        emailCell.textContent = contact.email;
        row.appendChild(emailCell);

        // Phones cell
        const phonesCell = document.createElement('td');
        contact.phones.forEach((phone) => {
            const phoneDiv = document.createElement('div');
            phoneDiv.textContent = `${phone.number} (${phone.type})${phone.isPrimary ? ' [Primary]' : ''}`;
            phonesCell.appendChild(phoneDiv);
        });
        row.appendChild(phonesCell);

        // Date cell
        const dateCell = document.createElement('td');
        dateCell.textContent = contact.date;
        row.appendChild(dateCell);

        table.appendChild(row);

    });
}


updateContactList();