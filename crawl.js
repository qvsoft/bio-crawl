var fileSave = function(data, filename) {
  if (!data) {
    console.error('Console.save: No data')
    return;
  }

  if (!filename) filename = 'console.json'

  if (typeof data === "object") {
    data = JSON.stringify(data, undefined, 4)
  }

  var blob = new Blob([data], {
      type: 'text/json'
    }),
    e = document.createEvent('MouseEvents'),
    a = document.createElement('a')

  a.download = filename
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  a.dispatchEvent(e)
}

var curUrl = window.location.href;

var getSiteName = function() {
  let siteName = "";

  if (!siteName) {
    let matches = /https?:\/\/(?:www\.)?.*?\/(.+?)(?:$|\/|\?)/i.exec(curUrl);
    siteName = matches[1];
  }

  if (!siteName) {
    let matches = /(?!https:\/\/www\.)https?:\/\/([^\.]+)?\.[0-9a-z-]{2,}\.[0-9a-z-]{2,}/i.exec(curUrl);
    siteName = matches[1];
  }

  return siteName;
}

var products = [];

jQuery(document).ready(function() {
  var siteSupported = true;
  var prependArea = "";

  if (curUrl.includes("beacons.ai")) {
    prependArea = "#root .PageFrame";
    //Delay in pages
    setTimeout(function() {
      $("[aria-label='links block link buttons'] > a").each(function(i) {
        let product = {};
        product.url = $(this).attr('href');
        
        let product_image_el = $(this).find(".BackgroundImage");
        if(!product_image_el.length) {
          product_image_el = $(this).find("div[role='figure']");
        }
        let product_image_matches = /"(https?:\/\/.*?)(?:\?|")/i.exec(product_image_el.attr("style"));
        if($.isArray(product_image_matches)) {
          product.product_image = product_image_matches[1];
        }
        
        product.product_name = $(this).find(".TextSide").text();
        
        if ($.trim(product.product_name) == "") {
          product.product_name = "Sản phẩm " + (i + 1);
        }
        
        product.category_name = "";
  
        products.push(product);
      });
    }, 100);
  } else if (curUrl.includes("instabio.cc")) {
    prependArea = "body > .body";
    $(".biolink.cmpt-button-buttonLink .button-item .btn.link").each(function(i) {
      let product = {};
      product.url = $(this).attr("href");
      product.product_image = $(this).find(".btn-icon > img").attr("src");

      product.product_name = $(this).find(".btn-text > p:first-child").text();

      if ($.trim(product.product_name) == "") {
        product.product_name = "Sản phẩm " + (i + 1);
      }

      product.category_name = "";

      products.push(product);
    });
  } else if (curUrl.includes("linktr.ee")) {
    prependArea = "#__next > .sc-bdfBwQ.sc-gsTCUz";
    $(".sc-bdfBwQ.jrDHLp > div a[aria-describedby='profile-pharrell ']").each(function(i) {
      let product = {};
      product.url = $(this).attr("href");

      product.product_image = $(this).find("img").attr("src");

      product.product_name = $(this).find("> p").text();

      if ($.trim(product.product_name) == "") {
        product.product_name = "Sản phẩm " + (i + 1);
      }

      product.category_name = "";

      products.push(product);
    });
  } else {
    siteSupported = false;
  }

  setTimeout(function() {
    console.clear();
    if (!siteSupported) {
      console.log("This site is not supported. Please contact PP team.");
    }

    //console.log('Danh sach lien ket');
    //console.log(JSON.stringify({"products": products}));

    if (prependArea) {
      let download_area = $("<div style='position: fixed;top: 10px;left: 10px;display: flex;flex-direction: column;place-items: flex-start;grid-gap: 4px;z-index: 999;'><div id='download-product-file' style='background: #007ccf;padding: 8px;border: 2px solid #e5e5e5;border-radius: 8px;cursor: pointer;color: #fff;'>🗎 Download Product File</div></div>");
      download_area.find("#download-product-file").on("click", function() {
        fileSave(JSON.stringify({
          "products": products
        }), [getSiteName(), "products_import.json"].join("_"));
        $(this).after("<div style='background: #ffffff99;padding: 8px;border-radius: 8px;'><small style='font-size: 12px;'>Thank you for downloading product file.<br/>Next step, import file to <a href='https://builder.passio.eco/?import=1' target='_blank'>Passio Page Affiliate</a></small></div>");
      });
      $(prependArea).prepend(download_area);
    }
  }, 1000);
});
