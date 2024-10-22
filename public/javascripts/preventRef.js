document.querySelectorAll('.favourite-form').forEach(form => {
    form.addEventListener('submit', async function (e) {
        e.preventDefault(); 

        const formData = new FormData(this);
        const action = this.action;

        try {
            const response = await fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const result = await response.json();

            const button = this.querySelector('button');
            const icon = button.querySelector('i');
            if (result.isFavourited) {
                button.classList.add('text-red-600');
                button.classList.remove('text-gray-300');
                icon.classList.add('fa-solid');
            } else {
                button.classList.add('text-gray-300');
                button.classList.remove('text-red-600');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});


const updateButtons = (form, isHelpful, counts) => {
    const helpfulButton = form.querySelector('.helpful-form button');
    const notHelpfulButton = form.querySelector('.not-helpful-form button');

    if (isHelpful) {
        helpfulButton.classList.add('text-blue-500', 'bg-blue-100');
        helpfulButton.classList.remove('text-black', 'bg-gray-100');
    } else {
        helpfulButton.classList.add('text-black', 'bg-gray-100');
        helpfulButton.classList.remove('text-blue-500', 'bg-blue-100');
    }
    helpfulButton.innerHTML = `Helpful (${counts.helpfulCount})`;

    if (!isHelpful) {
        notHelpfulButton.classList.add('text-red-500', 'bg-red-100');
        notHelpfulButton.classList.remove('text-black', 'bg-gray-100');
    } else {
        notHelpfulButton.classList.add('text-black', 'bg-gray-100');
        notHelpfulButton.classList.remove('text-red-500', 'bg-red-100');
    }
    notHelpfulButton.innerHTML = `Not Helpful (${counts.notHelpfulCount})`;
};

document.querySelectorAll('.helpful-form').forEach(form => {
    form.addEventListener('submit', async function (e) {
        e.preventDefault(); 

        const formData = new FormData(this);
        const action = this.action;

        try {
            const response = await fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const result = await response.json();

            const formContainer = this.closest('.expression-container');

            updateButtons(formContainer, true, result);

        } catch (error) {
            console.error('Error:', error);
        }
    });
});

document.querySelectorAll('.not-helpful-form').forEach(form => {
    form.addEventListener('submit', async function (e) {
        e.preventDefault(); 
        const formData = new FormData(this);
        const action = this.action;

        try {
            const response = await fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const result = await response.json();

            const formContainer = this.closest('.expression-container');

            updateButtons(formContainer, false, result);

        } catch (error) {
            console.error('Error:', error);
        }
    });
});
