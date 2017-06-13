/**
 * Created by thomas on 12.06.2017.
 */

$(document).ready(function(){
    // Add smooth scrolling to all links in navbar + footer link
    $(".navbar a, footer a[href='#mongoDemo']").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {

            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 900, function(){

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if


    });
    $.fn.dataTable.ext.errMode = 'none';
    $('#suchergebnis').DataTable({
        'ajax':'data/response.json',
        columns: [
            {data: 'name', width: '40%'},
            {data: 'genres', width: '20%'},
            {data: 'year', width: '10%'},
            {data: 'rating', width: '10%'},
            {data:'', width: '20%'}
        ],
        "bLengthChange": false,
        "language": {"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/German.json"}
    });

    $('#search').on( 'keyup click', function () {
        updateSearch();
    } );

})

$(window).scroll(function() {
    $(".slideanim").each(function(){
        var pos = $(this).offset().top

        var winTop = $(window).scrollTop();
        if (pos < winTop + 600) {
            $(this).addClass("slide");
        }
    });
});

function updateSearch () {
    $('#suchergebnis').DataTable().search(
        $('#search').val(),
        false,true
    ).draw();
}