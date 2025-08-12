// components/modal.js
(function (global) {
  const qs = (sel, root = document) => root.querySelector(sel);

  class Modal {
    constructor() {
      this.overlay = qs('#ui-modal-overlay');
      this.closeBtn = qs('.modal-close', this.overlay);
      this.titleEl = qs('#ui-modal-title', this.overlay);
      this.verifyEl = qs('#ui-modal-verify', this.overlay);
      this.obj = qs('#ui-modal-doc', this.overlay);
      this.img = qs('#ui-modal-img', this.overlay);
      this.slot = qs('#ui-modal-slot', this.overlay);
      this._bindBaseEvents();
    }

    _bindBaseEvents() {
      // overlay click closes
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });
      // X button
      this.closeBtn.addEventListener('click', () => this.close());
      // ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });
    }

    _reset() {
      // Clear content
      this.obj.removeAttribute('data');
      this.img.src = '';
      this.slot.innerHTML = '';
      this.obj.style.display = '';
      this.img.style.display = 'none';
      this.slot.style.display = 'none';
      // Verify link default
      this.verifyEl.removeAttribute('href');
      this.verifyEl.style.display = 'none';
    }

    openDoc({ path, verifyUrl = '', title = 'Document' }) {
      this._reset();
      this.titleEl.textContent = title;

      // verify link if provided
      if (verifyUrl) {
        this.verifyEl.href = verifyUrl;
        this.verifyEl.style.display = '';
      }

      const isImage = /\.(png|jpe?g|webp)$/i.test(path);
      if (isImage) {
        this.obj.style.display = 'none';
        this.img.src = path;
        this.img.style.display = 'block';
      } else {
        // Assume PDF by default
        this.obj.setAttribute('data', path);
        this.obj.style.display = '';
      }

      this._open();
    }

    openHTML({ html, verifyUrl = '', title = 'Details' }) {
      this._reset();
      this.titleEl.textContent = title;
      if (verifyUrl) {
        this.verifyEl.href = verifyUrl;
        this.verifyEl.style.display = '';
      }
      this.slot.innerHTML = html;
      this.slot.style.display = 'block';
      this.obj.style.display = 'none';
      this._open();
    }

    _open() {
      this.overlay.classList.add('open');
      document.body.classList.add('modal-open');
      this.closeBtn.focus();
    }

    close() {
      this._reset();
      this.overlay.classList.remove('open');
      document.body.classList.remove('modal-open');
    }

    /**
     * Delegated binding for data-attributes.
     * Triggers use:
     *  - data-modal-doc="path/to/file.pdf|.jpg"
     *  - data-modal-verify="https://verify.url"
     *  - data-modal-title="Optional Title"
     */
    bindDelegated(root = document) {
      root.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-modal-doc],[data-modal-html]');
        if (!btn) return;

        // Document mode (PDF/IMG)
        if (btn.dataset.modalDoc) {
          this.openDoc({
            path: btn.dataset.modalDoc,
            verifyUrl: btn.dataset.modalVerify || '',
            title: btn.dataset.modalTitle || btn.textContent.trim() || 'Document'
          });
          return;
        }
        // HTML mode (arbitrary content)
        if (btn.dataset.modalHtml) {
          this.openHTML({
            html: btn.dataset.modalHtml,
            verifyUrl: btn.dataset.modalVerify || '',
            title: btn.dataset.modalTitle || btn.textContent.trim() || 'Details'
          });
        }
      });
    }
  }

  // Singleton
  const modal = new Modal();
  modal.bindDelegated(document);
  // expose globally
  global.AKAGI_MODAL = modal;
})(window);
