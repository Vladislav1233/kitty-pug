$(document).ready(function () {

    if ($('#develop').length) {
        $('#develop').on('click',function () {
            var $dev = $('.dev');
            if ($(this).is(':checked')) {
                $dev.show();
            } else {
                $dev.hide();
            }
        });
    }

    if ($('.js-full-task').length) {
        $('.js-full-task').on('click',function () {
            var $this = $(this);
            var test = $this.data('test');
            var text =$this.text();
            $this.text('runing');
            $.ajax({
                'url': '/bs',
                data: {test: test},
                success: function () {
                    $this.text(text);
                }
            });
        });
    }
});
