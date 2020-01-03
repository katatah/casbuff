
window.addEventListener('DOMContentLoaded', (event) => {
  let emptySiromusu = new Siromusu({});

  //部隊一覧
let ut = new Vue({
  el: '#unitTable',
  data: {
    unit: [emptySiromusu,emptySiromusu,emptySiromusu,emptySiromusu,
      emptySiromusu,emptySiromusu,emptySiromusu,emptySiromusu]
  },
  methods: {
    del: function(s){
      let idx = this.unit.findIndex((u) => u == s);
      this.unit.splice(idx, 1, emptySiromusu);
    },
    add: function(s){
      for(let i = 0; i < 8; i++){
        if(this.unit[i] == emptySiromusu) {
          this.unit.splice(i, 1, s);
          return true;
        }
      }
      return false;
    }
  },
  created: function(){}
});


  //バフテーブルの表示条件
let sf = new Vue({
  el: '#siromusu_filter',
  data: {
    checkedBuki: [],
    checkedAttr: [],
    checkedRare: [],
    isLatest: false,
    isRangeOnly: false,
    isTrick: true
  },
  methods: {
    isMatch: function(siromusu){
      if(this.checkedBuki.length > 0) {
        if(!this.checkedBuki.includes(siromusu.buki)){
          return false;
        }
      }
      if(this.checkedAttr.length > 0) {
        let isMatch = false;
        for(let i = 0; i < this.checkedAttr.length; i++){
          isMatch = isAttr(this.checkedAttr[i], siromusu);
          if(isMatch) { break; }
        }
        if(!isMatch){
          return false;
        }
      }
      if(this.checkedRare.length > 0) {
        if(!this.checkedRare.includes(siromusu.rare + "")){
          return false;
        }
      }
      if(this.isLatest == true) {
        if(!siromusu.isLatest) {
          return false;
        }
      }
      let isRange = false;
      for(let j = 0; j < siromusu.skill.skillBuf.length; j++){
        const buff = siromusu.skill.skillBuf[j];
        if(buff.type == 0 || buff.type == "自身") { continue; }
        Object.getOwnPropertyNames(buff).forEach( prop => {
          if(/_p$/.test(prop)) { isRange = true; }
        });
        if(isRange) break;
      }
      if(this.isRangeOnly == true && !isRange) { return false; }
      if(this.isTrick == true && !siromusu.skill.trick) {
        return false;
      }
      return true;
    }
  },
  watch: {
    checkedBuki(){ bt.makeList(); },
    checkedAttr(){ bt.makeList(); },
    checkedRare(){ bt.makeList(); },
    isLatest(){ bt.makeList(); },
    isRangeOnly(){ bt.makeList(); },
    isTrick(){ bt.makeList(); }
  }
});

  //バフテーブル一覧
let bt = new Vue({
  el: '#buffTable',
  data: {
    list: []
  },
  methods: {
    add: function(s){
      let ret = ut.add(s);
      if(!ret){ alert("編成が8人埋まっています"); }
    },
    makeList: function(){
      this.list.splice(0);
      let ssl = [];
      siromusuSkillList.forEach((skill) => {
        const siromusu = skill.siromusu;
        if(sf.isMatch(siromusu)) {
          ssl.push(skill);
        }
      });
      ssl.sort( (a, b) => { return a.siromusu.no - b.siromusu.no } );
  
      function sp(skill, prop, buff, v) {
        if(!skill.s[prop]) { skill.s[prop] = ""; }
        else if(buff.type != "範囲外"){ skill.s[prop] += "<br>"; }
  
        if(buff.type == 0 || buff.type == "自身") {
          skill.s[prop] += "単" + v + "%";
        }
        else if(buff.type == "a") {
          skill.s[prop] += "全員" + v + "%";
        }
        else if(buff.type == "r") {
          skill.s[prop] += "範囲" + v + "%";
        }
        else if(buff.type == "範囲外") {
        }
        else{
          skill.s[prop] += buff.type + v + "%";
        }
      }
  
      for(let i = 0; i < ssl.length; i++) {
        let skill = ssl[i];
        skill.s = {};
        const siromusu = skill.siromusu;
        const buffs = skill.skillBuf;
        const trick = skill.trick;
        let bai = 1;
        if(["鈴", "歌舞"].includes(siromusu.buki)) {
          bai = siromusu.bigNum;
        }
        for(let j = 0; j < buffs.length; j++){
          const buff = buffs[j];
  
          Object.getOwnPropertyNames(buff).forEach( prop => {
            if(/_p$/.test(prop)) {
              let v = buff[prop] * bai;
              sp(skill, prop, buff, v);
            }
          });
        }
        if(trick && trick.buff)  {
          let buffs = trick.buff;
          for(let j = 0; j < buffs.length; j++){
            const buff = buffs[j];
    
            Object.getOwnPropertyNames(buff).forEach( prop => {
              if(/_p$/.test(prop)) {
                let v = "計:" + buff[prop];
                sp(skill, prop, buff, v);
              }
            });
          }
        }
        this.list.push(skill)
      }
    },
    sort: function(key) {
      if(key == "no") {
        this.list.sort( (a, b) => { return a.siromusu.no - b.siromusu.no } );
        return;
      }
      this.list.sort(function(a, b){
        if(!a.s[key] && !b.s[key]) { return 0; }
        if(a.s[key] && !b.s[key]) { return -1; }
        if(!a.s[key] && b.s[key]) { return 1; }
        return b.s[key].localeCompare(a.s[key]);
      });
    }
  },
  created: function(){
    this.makeList();
  }
});


});
