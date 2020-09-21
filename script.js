const MINUTES = 30;
function init() {
  const answers = {};
  let i = 0;
  return {
    timer: null,
    countdown: null,
    pairs: [],
    async init() {
      const response = await fetch('fetch.php');
      const { message, data } = await response.json();
      if (response.status !== 200) {
        this.$refs.timer.innerText = message;
      } else {
        this.pairs = data.map((datum, index) => ({
          ...datum,
          s: datum.s.replace(/[_]+/g, () => {
            const x = ++i;
            const __j__ = 'Jump' + x;
            const __n__ = 'Ans' + x;
            this.$refs.jumpers.innerHTML += `<button
              class="button is-small"
              x-ref="${__j__}"
              @click="reveal(${index}); $refs.${__n__}.focus()"
            >${x}</button>`;
            return `<input
              type="text"
              name="${__n__}"
              :value="answer('${__n__}')"
              placeholder="${x}."
              x-ref="${__n__}"
              @blur="save('${__n__}', $event.target.value, '${__j__}')"
            >`;
          }),
        }));
        this.$refs.timer.innerText = `Time Left: ${MINUTES}:00`;
        this.countdown = new Date(Date.now() + MINUTES * 60 * 1000);
        this.timer = setInterval(async () => {
          const remaining = new Date(this.countdown.getTime() - Date.now());
          this.$refs.timer.innerText = `Time Left: ${
            remaining.getMinutes().toString().length > 1
              ? remaining.getMinutes()
              : '0' + remaining.getMinutes()
          }:${
            remaining.getSeconds().toString().length > 1
              ? remaining.getSeconds()
              : '0' + remaining.getSeconds()
          }`;
          if (remaining.getTime() < 1000) {
            clearInterval(this.timer);
            this.$refs.timer.classList.add('has-text-danger');
            this.$refs.timer.innerText = 'EXPIRED!';
            await this.submit();
          }
        }, 1000);
      }
    },
    reveal(index) {
      for (const pair of this.pairs) {
        if (pair.$) pair.$ = false;
      }
      this.pairs[index].$ = true;
      for (const key of Object.keys(answers)) {
        if (answers[key]) {
          this.$refs[key].setAttribute('value', answers[key]);
        }
      }
    },
    save(name, value, jumper) {
      if (value) {
        this.$refs[jumper].classList.add('is-dark');
        answers[name] = value;
      } else {
        this.$refs[jumper].classList.remove('is-dark');
        delete answers[name];
      }
    },
    answer(ref) {
      return answers[ref] || '';
    },
    async submit() {
      clearInterval(this.timer);
      this.$refs.submit.disabled = true;
      const response = await fetch('store.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      const { message } = await response.json();
      if (response.status !== 201) {
        alert(message);
      } else {
        location.href = 'index.html';
      }
    },
  };
}
