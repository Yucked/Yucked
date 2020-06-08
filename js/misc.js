function createError(div, message) {
    var errorSection = $('<section></section>');
    errorSection.addClass('has-shadow section has-rounded-corners has-margin-25 is-light-red');

    var spanError = $('<span></span>');
    spanError.addClass('title');
    spanError.text(message);

    errorSection.append(spanError);
    $(div).append(errorSection);
}

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, n) {
        return args[n];
    });
};