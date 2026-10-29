/* Little Learning 3.0 — original Kindergarten–Grade 6 learning catalogue.
   Each topic is served by ten progressive levels from the reusable question engine.
   No K5 worksheet text or artwork is reproduced. */
window.LL_CATALOG=(function(){
  const gradeLabels=['Kindergarten','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'];
  const math=[
    [
      ['Counting 1–20','count','🍎'],['Number Recognition','number','🔢'],
      ['Number Patterns','pattern','🧩'],['Missing Numbers','missing','❓'],
      ['Compare Numbers','compare','⚖️'],['Odd & Even','odd','🎯'],
      ['Addition with Pictures','add','➕'],['Subtraction with Pictures','subtract','➖'],
      ['Shapes','shape','🔺'],['Sorting & Patterns','sort','🎨'],
      ['Measuring & Size','measure','📏'],['Time & Daily Routine','time','🕒'],
      ['Coins','money','🪙'],['Picture Graphs','graph','📊']
    ],
    [
      ['Counting to 100','count','🔢'],['Skip Counting','pattern','🐇'],
      ['Number Patterns','pattern','🧩'],['Compare Numbers','compare','⚖️'],
      ['Tens & Ones','place','🧱'],['Addition','add','➕'],
      ['Subtraction','subtract','➖'],['Missing Addends','missingadd','❓'],
      ['Equal Shares & Fractions','fraction','🍕'],['Measurement','measure','📏'],
      ['Counting Money','money','🪙'],['Telling Time','time','🕒'],
      ['Geometry','shape','🔷'],['Data & Graphing','graph','📊'],
      ['Word Problems','word','📘']
    ],
    [
      ['Numbers to 1,000','number','🔢'],['Skip Counting','pattern','🐇'],
      ['Place Value','place','🧱'],['Rounding','round','🎯'],
      ['Compare Numbers','compare','⚖️'],['Addition','add','➕'],
      ['Subtraction','subtract','➖'],['Multiplication Arrays','multiply','✖️'],
      ['Sharing & Division','divide','➗'],['Fractions','fraction','🍕'],
      ['Money','money','🪙'],['Time','time','🕒'],['Measurement','measure','📏'],
      ['Geometry','shape','🔷'],['Data & Graphing','graph','📊'],['Word Problems','word','📘']
    ],
    [
      ['Place Value','place','🧱'],['Rounding','round','🎯'],['Number Patterns','pattern','🧩'],
      ['Multiplication Tables','multiply','✖️'],['Division Facts','divide','➗'],
      ['Addition & Subtraction','add','➕'],['Fractions','fraction','🍕'],
      ['Decimals Introduction','decimal','🔟'],['Time & Calendars','time','🕒'],
      ['Money','money','🪙'],['Measurement','measure','📏'],
      ['Perimeter','perimeter','📐'],['Geometry','shape','🔷'],
      ['Data & Graphing','graph','📊'],['Word Problems','word','📘']
    ],
    [
      ['Large Numbers & Place Value','place','🧱'],['Rounding','round','🎯'],
      ['Addition & Subtraction','add','➕'],['Multiplication','multiply','✖️'],
      ['Long Division','divide','➗'],['Factors & Multiples','factors','🧩'],
      ['Order of Operations','order','🔢'],['Equivalent Fractions','fraction','🍕'],
      ['Fraction Operations','fractionadd','🥧'],['Decimals','decimal','🔟'],
      ['Area & Perimeter','area','📐'],['Angles','angle','📏'],
      ['Measurement','measure','📏'],['Graphs','graph','📊'],
      ['Multi-Step Word Problems','word','📘']
    ],
    [
      ['Whole Number Operations','add','➕'],['Factors & Multiples','factors','🧩'],
      ['Exponents','exponent','⚡'],['Fraction Operations','fractionadd','🥧'],
      ['Decimal Operations','decimal','🔟'],['Rounding','round','🎯'],
      ['Integers','integer','↔️'],['Algebraic Expressions','algebra','🧮'],
      ['Area & Perimeter','area','📐'],['Volume','volume','🧊'],
      ['Angles & Geometry','angle','📏'],['Unit Conversions','convert','📏'],
      ['Data & Graphing','graph','📊'],['Word Problems','word','📘']
    ],
    [
      ['Integers','integer','↔️'],['Number Properties','factors','🧩'],
      ['Exponents','exponent','⚡'],['Fractions','fractionadd','🥧'],
      ['Decimals','decimal','🔟'],['Percentages','percent','💯'],
      ['Ratios','ratio','⚖️'],['Proportions','proportion','🧪'],
      ['Algebra & Equations','algebra','🧮'],['Unit Conversions','convert','📏'],
      ['Area & Geometry','area','📐'],['Volume','volume','🧊'],
      ['Statistics & Graphs','graph','📊'],['Multi-Step Problems','word','📘']
    ]
  ];
  const english=[
    [
      ['Capital Letters','letters','🅰️'],['Small Letters','letters','🔡'],
      ['Letter Sounds','phonics','🔊'],['Missing Alphabets','missingletter','❓'],
      ['Two- and Three-Letter Words','spelling','🐱'],['Match Words & Pictures','vocabulary','🖼️'],
      ['Rhyming Words','rhyme','🎵'],['Simple Sentences','sentence','✍️']
    ],
    [
      ['Phonics','phonics','🔊'],['Sight Words','spelling','👀'],
      ['Word Families','rhyme','🎵'],['Spelling','spelling','✏️'],
      ['Vocabulary','vocabulary','📖'],['Sentence Building','sentence','🧩'],
      ['Grammar Basics','grammar','💬'],['Reading Comprehension','reading','📚']
    ],
    [
      ['Phonics & Blends','phonics','🔊'],['Spelling','spelling','✏️'],
      ['Vocabulary','vocabulary','📖'],['Prefixes & Suffixes','prefix','🧩'],
      ['Grammar','grammar','💬'],['Sentence Building','sentence','✍️'],
      ['Reading Comprehension','reading','📚'],['Word Meaning','synonym','🧠']
    ],
    [
      ['Vocabulary','vocabulary','📖'],['Spelling','spelling','✏️'],
      ['Synonyms & Antonyms','synonym','🔄'],['Prefixes & Suffixes','prefix','🧩'],
      ['Grammar','grammar','💬'],['Sentence Construction','sentence','✍️'],
      ['Reading Comprehension','reading','📚'],['Word Families','rhyme','🎵']
    ],
    [
      ['Vocabulary','vocabulary','📖'],['Spelling','spelling','✏️'],
      ['Synonyms & Antonyms','synonym','🔄'],['Prefixes & Suffixes','prefix','🧩'],
      ['Grammar & Tenses','grammar','💬'],['Sentence Structure','sentence','✍️'],
      ['Reading Comprehension','reading','📚']
    ],
    [
      ['Vocabulary','vocabulary','📖'],['Spelling','spelling','✏️'],
      ['Word Roots','prefix','🌱'],['Synonyms & Antonyms','synonym','🔄'],
      ['Grammar','grammar','💬'],['Sentence Structure','sentence','✍️'],
      ['Reading Comprehension','reading','📚']
    ],
    [
      ['Vocabulary','vocabulary','📖'],['Spelling','spelling','✏️'],
      ['Word Roots','prefix','🌱'],['Synonyms & Antonyms','synonym','🔄'],
      ['Grammar','grammar','💬'],['Writing Sentences','sentence','✍️'],
      ['Reading Comprehension','reading','📚']
    ]
  ];
  const make=(data,subject,grade)=>data.map(([name,kind,icon],i)=>({
    id:subject+'-'+grade+'-'+kind+'-'+i,subject,grade,name,kind,icon,levels:10
  }));
  const grades=gradeLabels.map((name,i)=>({
    id:i,label:name,math:make(math[i],'math',i),english:make(english[i],'english',i)
  }));
  const topics=grades.flatMap(g=>[...g.math,...g.english]);
  const byId=Object.fromEntries(topics.map(t=>[t.id,t]));
  return Object.freeze({grades,topics,byId,gradeLabels});
})();