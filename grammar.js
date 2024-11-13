module.exports = grammar({
  name: "arm", // have to use this since upstream has asm no

  extras: ($) => [$.comment, /\s/],

  rules: {
    program: ($) => repeat(choice(
      $.instruction,
      $.directive,
      $.label,
      $.comment
    )),


    instruction: $ =>
      seq(
        field('mnemonic', $.identifier),
        field('operands', seq($._expr, repeat(seq(',', $._expr)))))
    ,
    _expr: $ => choice(
      $.int,
      $.float,
      $.string,
      $.identifier,
    ),
    directive: ($) => seq(token(/[.][0-9a-zA-Z]+/)),

    label: ($) => seq($.identifier, ":"),

    comment: ($) => token(seq(';', token.immediate(/.*/))),

    identifier: ($) => /[a-zA-Z_]\w*/,

    int: $ => {
      const _int = /-?([0-9][0-9_]*|(0x|\$)[0-9A-Fa-f][0-9A-Fa-f_]*|0b[01][01_]*)/
      return choice(
        seq('#', token.immediate(_int)),
        _int,
      )
    },
    float: $ => /-?[0-9][0-9_]*\.([0-9][0-9_]*)?/,
    string: $ => /"[^"]*"/,
  }
});

