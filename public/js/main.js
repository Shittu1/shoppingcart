$(function() {
    if ($('textarea#ta').length) {
        CKEDITOR.replace('ta');
    }

    $('a.confirmDeletion').on('click', function() {
        if(!confirm('Click OK to delete this page, otherwise click CANCEL')) return false;
    });


});