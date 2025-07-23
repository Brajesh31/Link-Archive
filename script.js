$(document).ready(() =>{
    if (localStorage.getItem('links') === null) {
        localStorage.setItem('links', JSON.stringify([]));
    }else{
        addLink(JSON.parse(localStorage.getItem('links')));
    }
})

function addLink(links) {
    $('#link-list').empty();
    links.forEach((link, index) => {
        $('#link-list').append(`
            <li class="bg-[#fff8e1] p-4 rounded-lg shadow-md flex flex-row gap-2 mb-4 items-center justify-between border-2 border-[#c2a477]">
                <div class="flex flex-col gap-1">
                    <h5 class="font-bold text-xl text-black">${link.name}</h5>
                    <p class="text-sm text-[#a67c52]">${link.url}</p> 
                </div>
                <div class="flex gap-2">
                    <button id="delete-link" data-index="${index}" class="bg-[#b85c38] text-[#fff8e1] font-bold px-2 py-1 rounded-lg hover:bg-[#8b3e1b] transition cursor-pointer border-2 border-black">Delete</button>
                    <button id="edit-link" data-index="${index}" class="bg-[#e1b866] text-[#fff8e1] font-bold px-2 py-1 rounded-lg hover:bg-[#c2a477] transition cursor-pointer border-2 border-black">Edit</button>
                    <button id="visit-link" data-index="${index}" class="bg-[#6b8e23] text-[#fff8e1] font-bold px-2 py-1 rounded-lg hover:bg-[#4e6b1b] transition cursor-pointer border-2 border-black">Visit</button>
                </div>                    
            </li>
        `);
    });
}



$(document).on('submit','#add-link', (e) => {
    e.preventDefault();
    const name = $('#name').val();
    const url = $('#url').val();
    if (name && url){
        const links = JSON.parse(localStorage.getItem('links'));
        links.push({name, url});
        localStorage.setItem('links', JSON.stringify(links));
        addLink(links);
        $('#name').val('');
        $('#url').val('');
    }else{
        swal.fire({
            title: 'Error',
            text: 'Please fill in both fields',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }
})

$(document).on('click', '#delete-link', function() {
    const index = $(this).data('index');
    const links = JSON.parse(localStorage.getItem('links'));
    links.splice(index, 1);
    localStorage.setItem('links', JSON.stringify(links));
    addLink(links);
});

$(document).on('click', '#visit-link', function() {
    const index = $(this).data('index');
    const links = JSON.parse(localStorage.getItem('links'));
    const url = links[index].url;
    window.open(url, '_blank');
});

$(document).on('click', '#edit-link', function() {
    const index = $(this).data('index');
    const links = JSON.parse(localStorage.getItem('links'));
    const link = links[index];
    Swal.fire({
        title: 'Edit Link',
        icon: 'info',
        html: `
            <input id="edit-name" class="swal2-input w-full px-3 py-2 rounded border border-[#c2a477] focus:outline-none focus:ring-2 focus:ring-[#e1b866] mb-2" placeholder="Link Name" value="${link.name}">
            <input id="edit-url" class="swal2-input w-full px-3 py-2 rounded border border-[#c2a477] focus:outline-none focus:ring-2 focus:ring-[#e1b866]" placeholder="Link URL" value="${link.url}">
        `,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            const newName = $('#edit-name').val();
            const newUrl = $('#edit-url').val();
            if (newName && newUrl) {
                links[index] = { name: newName, url: newUrl };
                localStorage.setItem('links', JSON.stringify(links));
                addLink(links);
                Swal.fire({
                    title: 'Success',
                    text: 'Link updated successfully',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Please fill in both fields',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    });
})

$(document).on('input', '#search', function() {
    const query = $(this).val().toLowerCase();
    const links = JSON.parse(localStorage.getItem('links'));
    const filteredLinks = links.filter(link => link.name.toLowerCase().includes(query) || link.url.toLowerCase().includes(query));
    addLink(filteredLinks);
})