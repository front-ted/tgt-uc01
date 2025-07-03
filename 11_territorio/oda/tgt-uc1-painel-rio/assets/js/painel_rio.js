$('.msg-ajuda').hide();
$('.btn-start').click(function () {
    $('.tela-intro').fadeOut();
    setTimeout(() => {
        $('.msg-ajuda').fadeIn();
    }, 750);
});
$('.btn').click(function () {
    if ($(this).hasClass('nao-clicado')) { $(this).removeClass('nao-clicado') }
})