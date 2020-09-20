const MINUTES = 30;
function init() {
  const answers = [];
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
            const __n__ = 'Ans' + x;
            const __p__ = x + '.';
            this.$refs.jumpers.innerHTML += `<button
              class="button is-small is-rounded"
              x-ref="jumper${x}"
              @click="reveal('${index}'); $refs.${__n__}.focus()"
            >${x}</button>`;
            return `<input
              type="text"
              name="${__n__}"
              placeholder="${__p__}"
              x-ref="${__n__}"
              @blur="save($event, 'jumper${x}')"
            >`;
          }),
        }));
        this.$refs.timer.innerText = `${MINUTES}:00`;
        this.countdown = new Date(Date.now() + MINUTES * 60 * 1000);
        this.timer = setInterval(async () => {
          const remaining = new Date(this.countdown.getTime() - Date.now());
          this.$refs.timer.innerText = `${
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
      this.pairs.forEach((pair) => {
        pair.$ = false;
      });
      this.pairs[index].$ = true;
    },
    save(event, ref) {
      if (event.target.value) {
        this.$refs[ref].classList.add('is-dark');
        answers.push({ [event.target.name]: event.target.value });
      } else {
        this.$refs[ref].classList.remove('is-dark');
        const __i__ = answers.findIndex(
          (ans) => ans[event.target.name] !== undefined
        );
        answers.splice(__i__, 1);
      }
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
