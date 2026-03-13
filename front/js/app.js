document.addEventListener('DOMContentLoaded', function () {

  // Char counter do textarea
  var textarea  = document.getElementById('problema');
  var charCount = document.getElementById('charCount');
  if (textarea && charCount) {
    textarea.addEventListener('input', function () {
      charCount.textContent = this.value.length;
    });
  }

  // Envio do formulário
  var form    = document.getElementById('formChamado');
  var toastEl = document.getElementById('successToast');
  if (form && toastEl) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      var toast = new bootstrap.Toast(toastEl, { delay: 3500 });
      toast.show();
      form.reset();
      form.classList.remove('was-validated');
      if (charCount) charCount.textContent = '0';
    });
  }

});
