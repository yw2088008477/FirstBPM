$("#processModelContent").load(function () {
    var mainheight = $(this).contents().find("body").height() + 10000;
    $(this).height(mainheight);
});
