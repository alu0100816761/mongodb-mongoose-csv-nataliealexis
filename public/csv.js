// See http://en.wikipedia.org/wiki/Comma-separated_values
(() => {
"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

const resultTemplate = `
<div class="contenido">
      <table class="center" id="result">
          <% _.each(rows, (row) => { %>
          <tr class="<%=row.type%>">
              <% _.each(row.items, (name) =>{ %>
              <td><%= name %></td>
              <% }); %>
          </tr>
          <% }); %>
      </table>
  </p>
</div>
`;

/* Volcar la tabla con el resultado en el HTML */
const fillTable = (data) => {
  $("#finaltable").html(_.template(resultTemplate, { rows: data.rows }));
};

/* Volcar en la textarea de entrada
 * #original el contenido del fichero fileName */
const dump = (fileName) => {
  $.get(fileName, function (data) {
      $("#original").val(data);
  });
};

const handleFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.target.files;

  var reader = new FileReader();
  reader.onload = (e) => {

    $("#original").val(e.target.result);
  };
  reader.readAsText(files[0])
  /*var file = evt.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        myText.innerHTML = e.target.result;
      }
      var c = reader.readAsText(file);
    }
    else { alert("Failed to load file"); }*/
}

/* Drag and drop: el fichero arrastrado se vuelca en la textarea de entrada */
const handleDragFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files;
  var reader = new FileReader();
    reader.onload = (e) => {

      $("#original").val(e.target.result);
      evt.target.style.background = "white";
    };
    reader.readAsText(files[0])
}

const handleDragOver = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  evt.target.style.background = "yellow";
}

const fillBd = (texto) => {
  $("#original").val(texto.text);
  $("#nombre").val(texto.name);
}

$(document).ready(() => {
    let original = document.getElementById("original");
    let nombre = document.getElementById("nombre");
    if (window.localStorage && localStorage.original) {
      original.value = localStorage.original;
    }

   $("#botoncalcular").click( () => {
        if (window.localStorage) localStorage.original = original.value;
        $.get("/csv", /* Request AJAX para que se calcule la tabla */
          { input: original.value },
          fillTable,
          'json'
        );
   });
   
   $("#guardar").click( () => {
        $.get("/save",
          { input: original.value,
            name: nombre.value},
          'json'
        );
   });
   
   $("#1").click( () => {
      $.get("/descargar",
        { input: 1 },
        fillBd,
        'json'
      );
   });
   
   $("#2").click( () => {
      $.get("/descargar",
        { input: 2 },
        fillBd,
        'json'
      );
   });
   
   $("#3").click( () => {
      $.get("/descargar",
        { input: 3 },
        fillBd,
        'json'
      );
   });
   
   $("#4").click( () => {
      $.get("/descargar",
        { input: 4 },
        fillBd,
        'json'
      );
   });
   
   /* botones para rellenar el textarea */
   /*$('button.filabotones').each( (_,y) => {
     $(y).click( () => { dump(`${$(y).text()}.txt`); });
   });*/

    // Setup the drag and drop listeners.
    //var dropZone = document.getElementsByClassName('drop_zone')[0];
    let dropZone = $('.drop_zone')[0];
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleDragFileSelect, false);
    let inputFile = $('.inputfile')[0];
    inputFile.addEventListener('change', handleFileSelect, false);
 });
})();
