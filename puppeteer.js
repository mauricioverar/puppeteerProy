import puppeteer from "puppeteer"
  
;(async () => {
  try {
    console.log("Abriendo el navegador......")
    // Inicie el navegador y abra una nueva página en blanco.
    const browser = await puppeteer.launch({
      headless: "new", // con false abre y muestra el navegador
    })

    const page = await browser.newPage()

    console.log("entrando a books...")
    await page.goto("https://books.toscrape.com/") // entrar en esta web

    // Establecer tamaño de pantalla
    await page.setViewport({ width: 1080, height: 1024 })


    //Esperando....
    await page.waitForSelector("[class=row]") // esperar la carga del componente q contiene link a
    
    await page.screenshot({ path: "books/book01.jpg" }) // captura de pantalla
    console.log("capturando pantalla")

    // inspeccionar pagina
    console.log("inspeccionando la página...")

    // control de codigo fuente de la pagina
    const enlaces = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        "[class=row] li article div a"
      )

      const links = []
      for (let element of elements) {
        links.push(element.href)
      }
      return links
    })
    console.log("enlaces encontrados: ", enlaces.length) //  numero de enlaces (20)

    const registros = []
    console.log("recorriendo enlaces encontrados...")
    for (let enlace of enlaces) {
      await page.goto(enlace)
      await page.waitForSelector(".product_main") // esperar carga de esta clase

      const info = await page.evaluate(() => {
        const tmp = {}
        tmp.titulo = document.querySelector(".product_main h1").innerHTML
        tmp.precio = document.querySelector(".product_main p").innerHTML
        return tmp
      })
      registros.push(info)
    }
    console.log("entregando información en Json")
    console.log("registros: ", registros)

    await page.screenshot({ path: "books/book02.jpg" }) //
    console.log("capturando")

    await browser.close()
  } catch (error) {
    console.log("No se pudo crear una instancia del navegador => : ", error)
    return
  }
})()

/*

node puppeteer
  
*/
