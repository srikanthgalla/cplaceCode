let page = new Search()
      .add(Filters.type('cf.cplace.fpfs.operationalPlanning'));


let result = '<ul>';
let targetPage = embeddingPage.get('cf.cplace.fpfs.operationalPlanning');
  if (targetPage !== null) {
  let url = pages.getUrl();
  let name = 'back to OP';
  result = `<a href="${url}">${name}</a>`;
  }

return result;



let result = '';
let targetPage = embeddingPage.get('cf.cplace.fpfs.operationalPlanning');
        if (targetPage !== null) {
            let link = targetPage.getUrl();
            let name = targetPage.getName();
  result = `<button><a href="${url}">${name}</button><>`;
  }

return result;


//let url = 'https://cplace-dev.rd.corpintra.net/prm/pages/dlgfnkza8jei2yg9a351blkls/FreDaNext#_sy3pro5z3t8ssooilunede2p9=cf.cplace.fpfs.layout.operational%20Planning';
cplace.actions().setTransitionTargetUrl(url, true);