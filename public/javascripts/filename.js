document.getElementById('image').addEventListener('change', function(event) {
    const fileNamesContainer = document.getElementById('file-names');
    const files = event.target.files;
    fileNamesContainer.innerHTML = '';

    if (files.length > 0) {
        const fileNamesList = document.createElement('ul');
        for (let i = 0; i < files.length; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = files[i].name;
            fileNamesList.appendChild(listItem);
        }
        fileNamesContainer.appendChild(fileNamesList);
    } else {
        fileNamesContainer.textContent = 'No files selected';
    }
});
