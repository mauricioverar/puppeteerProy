import puppeteer from "puppeteer"
;(async () => {
  try {
    console.log("Abriendo el navegador......")
    // Inicie el navegador y abra una nueva página en blanco.
    const browser = await puppeteer.launch({
      headless: "new",
      /* args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true, */
    })

    const page = await browser.newPage()

    console.log("entrando a google...")
    await page.goto("https://www.google.cl/")

    // Establecer tamaño de pantalla
    await page.setViewport({ width: 1080, height: 1024 })

    // captura de pantalla
    console.log("capturando pantalla del buscador")
    await page.screenshot({ path: "imagenes/google17.jpg" })

    await page.type("#APjFqb", "incubadora desafio")
    console.log("capturando pantalla de búsqueda")
    await page.screenshot({ path: "imagenes/google18.jpg" })

    //Espere y haga clic en el primer resultado.
    await page.click(".gNO89b") //google
    console.log("haciendo clic en buscar")
    await page.waitForSelector("[data-snc=ih6Jnb_PcjQmf]") //google  esperar la carga del componente q contiene link a
    console.log("esperando resultado de la búsqueda")
    await page.screenshot({ path: "imagenes/google19.jpg" }) //
    console.log("capturando pantalla de resultado")

    // inspeccionar pagina
    console.log("inspeccionando la página...")
    const enlaces = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        "[data-snc=ih6Jnb_PcjQmf] div div div span a"
      )

      const links = []
      for (let element of elements) {
        links.push(element.href)
      }
      return links
    })
    console.log("enlaces encontrados: ", enlaces.length) // numero de enlaces

    const registros = []
    console.log("recorriendo enlaces encontrados...")
    for (let enlace of enlaces) {
      await page.goto(enlace)
      await page.waitForSelector(".carreras-en-que-consiste") // esperar carga de esta clase

      const info = await page.evaluate(() => {
        const tmp = {}
        tmp.data1 = document.querySelector(
          ".carreras-en-que-consiste li"
        ).innerHTML
        tmp.data2 = document.querySelector(".detalle-programa h4").innerHTML
        return tmp
      })
      registros.push(info)
    }
    console.log("entregando información en Json")
    console.log("registros: ", registros)
    /*
    registros:  [
      {
        data1: 'Asignación de Equipos (Front y Back)',
        data2: 'Comencemos'
      }
    ]
    */

    await browser.close()
  } catch (error) {
    console.log("No se pudo crear una instancia del navegador => : ", error)
    return
  }
})()

/*
  node index
  
*/
