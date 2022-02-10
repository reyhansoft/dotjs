class Card extends HTMLElement {
  constructor () {
    super()
    const imgSrc = this.getAttribute('img-src')

    const content = `<style>
  @import url(/themes/default/css/bootstrap.rtl.min.css);
  @import url(/themes/default/css/main.css);
</style><div class="card">
  <img class="card-img-top">
  <div class="card-body">
    <h5 class="card-title"><slot name="title" /></h5>
    <h6 class="card-subtitle mb-2 text-muted"><slot name="subtitle" /></h6>
    <p class="card-text"><slot name="body" /></p>
    <slot name="footer" />
  </div>
</div>`
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = content
    const img = this.shadowRoot.querySelector('img')
    if (imgSrc) {
      img.src = imgSrc
    } else {
      img.style.display = 'none'
    }
  }
}
customElements.define('djs-card', Card)

class Badge extends HTMLElement {
  constructor () {
    super()
    const type = this.getAttribute('type') || 'primary'

    const content = `<style>
  @import url(/themes/default/css/bootstrap.rtl.min.css);
  @import url(/themes/default/css/main.css);
</style><span class="badge bg-${type}">${this.innerHTML}</span>`
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = content
  }
}
customElements.define('djs-badge', Badge)
