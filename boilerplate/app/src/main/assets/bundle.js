console.log('wooo!')
$(function () {
    var clickCount = 0;
    $('.foo').click(function () {
        clickCount++

        $('.count').text(clickCount)
    })
})