// Demo store finder: same markup as namyang.com.tw/location, data from stores-data.js
(function () {
  var D = window.NY_STORES || { cities: [], stores: [] };
  window.nyGetArea = function (cityName, cb) {
    var c = D.cities.filter(function (x) { return x.name === cityName; })[0];
    var list = c ? c.areas.map(function (a) { return { id: a.id, area_name: a.name }; }) : [];
    setTimeout(function () { cb(list); }, 0);
  };
  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  var area = parseInt(new URLSearchParams(location.search).get('area') || '', 10);
  var hidden = document.getElementById('area');
  var citySel = document.getElementById('store_city');
  if (area && hidden) hidden.value = area;
  if (area && citySel) {
    D.cities.forEach(function (c, i) {
      if (c.areas.some(function (a) { return a.id === area; })) {
        for (var k = 0; k < citySel.options.length; k++) {
          citySel.options[k].selected = citySel.options[k].text === c.name;
        }
      }
    });
  }
  var box = document.getElementById('ny-stores');
  if (!box) return;
  var rows = area ? D.stores.filter(function (s) { return s.area === area; }) : [];
  if (!rows.length) {
    box.innerHTML = '<h5 class="text-center">此區尚無銷售點</h5>';
    return;
  }
  var icon = { '奶粉': 'icon-milk', '輔食': 'icon-food' };
  box.className = 'box';
  box.innerHTML = rows.map(function (s) {
    var logo = s.logo ? '<img src="' + esc(s.logo) + '" class="img-fluid" alt="" loading="lazy">' : '';
    var tags = (s.tags || []).map(function (t) {
      return '<div class="icon-item ml-2"><i class="icon ' + (icon[t] || '') + '"></i>' + esc(t) + '</div>';
    }).join('');
    return '<div class="shop-group row no-gutters flex-column flex-md-row align-items-center px-3 py-2">' +
      '<div class="col-md-2 img-shop mr-4 mb-2 mb-md-0 d-none d-lg-block">' + logo + '</div>' +
      '<div class="col-md-10 info-shop row px-3">' +
      '<div class="pic-mobile d-flex justify-content-between align-items-center d-md-none mb-2">' +
      logo.replace('class="img-fluid"', 'class="img-fluid mr-2"') + '<h5>' + esc(s.name) + '</h5></div>' +
      '<h5 class="col-12 p-0 my-2 d-none d-lg-block">' + esc(s.name) + '</h5>' +
      '<ul class="col-12 list-unstyled"><li>' + esc(s.tel) + '</li>' +
      '<li class="row mx-0"><p class="col-12 col-md-8 mb-2">' + esc(s.addr) + '</p>' +
      '<div class="icon-group col-12 col-md-4 p-0"><div class="d-flex justify-content-end">' + tags +
      '</div></div></li></ul></div></div>';
  }).join('');
})();
