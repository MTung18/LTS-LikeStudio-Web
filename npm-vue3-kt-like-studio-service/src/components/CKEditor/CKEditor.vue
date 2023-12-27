<template>
  <div id="container">
    <div id="content"></div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps, onMounted } from 'vue';
import Quill from "quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import ImageUploader from "quill-image-uploader";
import quillBetterTable from 'quill-better-table';

Quill.register("modules/imageUploader", ImageUploader);

Quill.register(
  {
    'modules/better-table': quillBetterTable,
  },
  true
);

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const content = ref('');


onMounted(() => {
  var curQuillDiv = document.getElementById('content');
  var containerDiv = document.getElementById('container');
  var tableOptions = [];
  var maxRows = 7;
  var maxCols = 7;

  for (let r = 1; r <= maxRows; r++) {
    for (let c = 1; c <= maxCols; c++) {
      tableOptions.push('newtable_' + r + '_' + c);
    }
  }

  var toolbarOptions = [
    [{ indent: '-1' }, { indent: '+1' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }],
    [{ 'background': [] }],
    ['image'],

    ['clean'],
    [{ 'Table-Input': tableOptions }],
  ];

  var curQuill = new Quill(curQuillDiv, {
    placeholder: 'Compose your text...',
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions,
      table: false,
      'better-table': {
        operationMenu: {
          items: {
            unmergeCells: {
              text: 'Unmerge cells',
            },
          },
          color: {
            colors: ['green', 'red', 'yellow', 'blue', 'white'],
            text: 'Background Colors:',
          },
        },
      },
      keyboard: {
        bindings: quillBetterTable.keyboardBindings,
      },
      imageUploader: {
        upload: file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => {
              const base64Image = event.target.result;

              const image = new Image();
              image.src = base64Image;

              image.onload = () => {
                const canvas = document.createElement('canvas');
                const maxWidth = 800;
                const maxHeight = 600;

                let width = image.width;
                let height = image.height;

                if (width > height) {
                  if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                  }
                } else {
                  if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                  }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, width, height);

                canvas.toBlob(blob => {
                  const compressedReader = new FileReader();
                  compressedReader.onload = compressedEvent => {
                    const compressedBase64 = compressedEvent.target.result;
                    resolve(compressedBase64);
                  };
                  compressedReader.readAsDataURL(blob);
                }, file.type);
              };
            };
            reader.readAsDataURL(file);
          });
        }
      }
    },
    placeholder: '...',
    theme: 'snow',
  });

  var curTableIconSpan = curQuillDiv
    .parentElement.querySelector('span.ql-Table-Input.ql-picker').childNodes[0];
  curTableIconSpan.innerHTML =
    '<svg style="right: 4px;" viewbox="0 0 18 18"> <rect class=ql-stroke height=12 width=12 x=3 y=3></rect> <rect class=ql-fill height=2 width=3 x=5 y=5></rect> <rect class=ql-fill height=2 width=4 x=9 y=5></rect> <g class="ql-fill ql-transparent"> <rect height=2 width=3 x=5 y=8></rect> <rect height=2 width=4 x=9 y=8></rect> <rect height=2 width=3 x=5 y=11></rect> <rect height=2 width=4 x=9 y=11></rect> </g> </svg>';

  var curTableCellIconSpans = Array.from(
    curTableIconSpan.parentElement.childNodes[1].children
  );
  curTableCellIconSpans.forEach(function (el) {
    el.addEventListener('click', function () {
      var curQuillBetterTable = curQuill.getModule('better-table');
      var curQuillToolbar = curQuill.getModule('toolbar');
      var curRowIndex = Number(this.dataset.value.substring(9).split('_')[0]);
      var curColIndex = Number(this.dataset.value.substring(9).split('_')[1]);
      curQuillBetterTable.insertTable(curRowIndex, curColIndex);
      curTableCellIconSpans.forEach(function (el) {
        el.classList.remove('ql-selected', 'ql-active');
      });
    });
    el.addEventListener('mouseenter', function () {
      var curRowIndex = Number(this.dataset.value.substring(9).split('_')[0]);
      var curColIndex = Number(this.dataset.value.substring(9).split('_')[1]);
      curTableCellIconSpans.forEach(function (el) {
        var curRowIndex1 = curRowIndex;
        var curColIndex1 = curColIndex;
        Array.from(el.parentElement.children).forEach(function (el) {
          var curRowIndex2 = Number(el.dataset.value.substring(9).split('_')[0]);
          var curColIndex2 = Number(el.dataset.value.substring(9).split('_')[1]);
          if (curRowIndex2 <= curRowIndex1 && curColIndex2 <= curColIndex1) {
            el.classList.add('ql-picker-item-highlight');
          }
        });
      });
    });
    el.addEventListener('mouseleave', function () {
      curTableCellIconSpans.forEach(function (el) {
        Array.from(el.parentElement.children).forEach(function (el) {
          el.classList.remove('ql-picker-item-highlight');
        });
      });
    });
  });


  containerDiv.addEventListener('mouseleave', () => {
    const savedSelection = curQuill.getSelection();
    content.value = curQuill.root.innerHTML;
    curQuill.setSelection(savedSelection);
  });

  watch(
    () => props.modelValue,
    (newVal) => {
      content.value = newVal;
      if(newVal != null){
        document.getElementsByClassName('ql-editor')[0].innerHTML = content.value;
      }
    },
    {
      immediate: true,
    }
  );

  watch(
    () => content.value,
    (newVal) => {
      emit('update:modelValue', newVal);
    }
  );
});

</script>

<style>
@import url('https://cdn.quilljs.com/2.0.0-dev.3/quill.snow.css');
@import url('https://unpkg.com/quill-better-table@1.2.7/dist/quill-better-table.css');

.ql-snow .ql-Table-Input .ql-picker-options {
  padding: 3px 5px;
  width: 152px;
}

.ql-snow .ql-Table-Input .ql-picker-item {
  border: 1px solid transparent;
  float: left;
  height: 16px;
  margin: 2px;
  padding: 0px;
  width: 16px;
  background: lightsteelblue;
}

.ql-snow .ql-Table-Input .ql-picker-item:hover,
.ql-snow .ql-Table-Input .ql-picker-item.ql-picker-item-highlight {
  border-color: #000;
  background: steelblue;
}

.ql-snow .ql-Table-Input.ql-picker {
  width: 28px;
}

.ql-snow .ql-Table-Input.ql-picker .ql-picker-label {
  padding: 2px 4px;
}
</style>