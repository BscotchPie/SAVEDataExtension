
// create by scratch3-extension generator
const ArgumentType = Scratch.ArgumentType;
const BlockType = Scratch.BlockType;
const formatMessage = Scratch.formatMessage;
const log = Scratch.log;

const menuIconURI = "data:image/webp;base64,UklGRs4CAABXRUJQVlA4WAoAAAASAAAAEwAAEwAAQU5JTQYAAAAAAAAAAABBTk1GtgAAAAAAAAAAABMAABMAAKoAAAJWUDhMngAAAC8TwAQQL0AWYJocxM4IQognIgHSJBtoRm84SzUBkLBBanATA7fzHwDtTERps//BQW2rYfNxQImCnCpIXwzshDgI/sVkIiL6PwGS/PeYbu+LMEneyUmY1OFMCGmwTkKTf6za8JrzD+tX5SQGeaoqs43MunfmqTuzjcxTtSetQ1ZNCAfOZf5B7slrGrA2NKnDSgjJO0zCJHlnhun25zFJQU5NRkYAAAABAAABAAAPAAAOAACqAAAAVlA4TC0AAAAvD4ADEA8w+IM/+vMf8FAbSWqbPuS9FCqkFEojov/hgAkQNL23XN5vmgwPgAAAQU5NRowAAAAAAAAAAAATAAASAACqAAAAVlA4THMAAAAvE4AEECdApG2bm56h4es5kbZtblaG5+CyrqBtGxaX192Z/wDQWbLR/+AgkqRIqgEEbJwCrjDw+je3r4SI/k8AwMF9fWB6l6uST6ua1lUxb869LFo6mekq6Lz4/U80Bc099wTQS5s9n1bWdAGauK7yAekNAEFOTUY2AAAAAwAAAwAABgAABgAAqgAAAFZQOEwdAAAALwaAARAPMJRjOLfzH/BQyDYCHNqZfSQX0f+4AA8AQU5NRloAAAACAAACAAAKAAAJAACqAAAAVlA4TEIAAAAvCkACEBcgEEhxXKMsEEhxXDMsEEjyWm34+Q/4V6C0jSRX0u5Lxz/yL+XosxzwRfQ/CC9azpc92A0VTo19yG6lwANBTk1GYgAAAAIAAAIAAAoAAAkAAKoAAABWUDhMSQAAAC8KQAIQHyAkIFN2mSITEpApu2ywhpCA8Et0y/j5D0Bd9YGSAGCaMTlFBPRSokjysRT6R0OZiP4HgiLN2dJ9WAtIEPpjHRQNMygA";
const blockIconURI = "data:image/webp;base64,UklGRgwDAABXRUJQVlA4WAoAAAASAAAAdwAAdwAAQU5JTQYAAAAAAAAAAABBTk1GmgAAAAAAAAAAAHcAAHEAAKoAAAJWUDhMgQAAAC93QBwQFyAQSPJnGHQUIUHC/+Beo1gwmb9TYl3zH/CvwG0kSYrU8vrH1j1DuXlMHStG9H8CNP+GNu1IAMGvFu26MQC3Yozx3c1iBAgWAbQ4k1FvGI2L3wCuDFtczKgkVyQx3qbeEDTTlXFgjKA1XZFEswziG7d0G2h9X8AviaBeBQBBTk1GaAAAAAYAAAYAAF8AAFkAAKoAAABWUDhMUAAAAC9fQBYQDzD4gz/68x/wYBBJipypQgCSsI4kBFz+P6yAiP5PAMfB3V4yy0KE0nQJ6VCmIDhGu1q4HL2Cy4BeMOIw6Ec6lCmgjJu9GOkihIYAQU5NRowAAAAAAAAAAAB3AABxAACqAAACVlA4THQAAAAvd0AcEBcgEEjyZxh0FCFBwv/gXqNYMJm/U2Jd8x/wr8BpJEmO1Hj8K7LWnb7/cvMlOkki+j8BuahbP1jbSD90vm4mZpPYYDa/bpV0AipgZSslNl5n89+tks7tBtaGssGsDWa3UidgJZ3MWptItfLlRrr7AkFOTUZEAAAAEgAAEgAAKQAAKQAAqgAAAFZQOEwsAAAALylAChAPMJRjOLfzH/BQ00gKtMkJQBLWkYQD6reP6P8EOERpAND1b6qrbAJBTk1GaAAAAAwAAAwAAEEAADsAAKoAAAJWUDhMTwAAAC9BwA4QFyAQSPJnGHQUIUHC/+Beo1gwmb9TYl3zH/CvgG0jSYrG3vwOo3uGDvTxwI3o/wSoRwc6guyw0gHOObeCFU0S2WG6XCgN6G7TFR8AQU5NRn4AAAAMAAAMAABBAAA7AACqAAACVlA4TGUAAAAvQcAOEBcgEEjyZxh0FCFBwv/gXqNYMJm/U2Jd8x/wr8BpJEmO1Hj8a3LWvRbp5x+a5xH9nwCT82YrflxgMyQBkqVy4SjamuyVONq2T0mSvXLxT1qzmqN9chR7XcAkFzBLweTkWgA=";

class saveData{
  constructor (runtime){
    this.runtime = runtime;
    // communication related
    this.comm = runtime.ioDevices.comm;
    this.session = null;
    this.runtime.registerPeripheralExtension('saveData', this);
    // session callbacks
    this.reporter = null;
    this.onmessage = this.onmessage.bind(this);
    this.onclose = this.onclose.bind(this);
    this.write = this.write.bind(this);
    // string op
    this.decoder = new TextDecoder();
    this.lineBuffer = '';
  }

  onclose (){
    this.session = null;
  }

  write (data, parser = null){
    if (this.session){
      return new Promise(resolve => {
        if (parser){
          this.reporter = {
            parser,
            resolve
          }
        }
        this.session.write(data);
      })
    }
  }

  onmessage (data){
    const dataStr = this.decoder.decode(data);
    this.lineBuffer += dataStr;
    if (this.lineBuffer.indexOf('\n') !== -1){
      const lines = this.lineBuffer.split('\n');
      this.lineBuffer = lines.pop();
      for (const l of lines){
        if (this.reporter){
          const {parser, resolve} = this.reporter;
          resolve(parser(l));
        };
      }
    }
  }

  scan (){
    this.comm.getDeviceList().then(result => {
        this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, result);
    });
  }

  getInfo (){
    return {
      id: 'saveData',
      name: 'SAVE DATA',
      color1: '#4c5a7c',
      color2: '#212a40',
      menuIconURI: menuIconURI,
      blockIconURI: blockIconURI,
      blocks: [
        {
          opcode: 'saveToLS',
          blockType: BlockType.COMMAND,
          arguments: {
            file: {
              type: ArgumentType.STRING
            }
          },
          text: 'SAVE to [file]'
        },
        {
          opcode: 'loadFromLS',
          blockType: BlockType.COMMAND,
          arguments: {
            file: {
              type: ArgumentType.STRING
            }
          },
          text: 'LOAD [file]'
        },
        {
          opcode: 'getKeyOfSAVE',
          blockType: BlockType.REPORTER,
          arguments: {
            key: {
              type: ArgumentType.STRING
            }
          },
          text: 'get [key] of SAVE'
        },
        {
          opcode: 'deleteKeyInSAVE',
          blockType: BlockType.COMMAND,
          arguments: {
            key: {
              type: ArgumentType.STRING
            }
          },
          text: 'delete [key] in SAVE'
        },
        {
          opcode: 'setKeyInSAVE',
          blockType: BlockType.COMMAND,
          arguments: {
            key: {
              type: ArgumentType.STRING
            },
            value: {
              type: ArgumentType.STRING
            }
          },
          text: 'set [key] in SAVE to [value]'
        },
        {
          opcode: 'listKeysInSAVE',
          blockType: BlockType.REPORTER,
          text: 'list keys in SAVE'
        }
      ]
    }
  }

saveToLS (args, util){
  const file = args.file;
    localStorage.setItem(variables.savespace + ":" + file, variables.savedata);
  return this.write(`M0 \n`);
}

loadFromLS (args, util){
  const file = args.file;
  variables.savedata = localStorage.getItem(variables.savespace + ":" + file)
  return this.write(`M0 \n`);
}

getKeyOfSAVE (args, util){
  const key = args.key;
  return variables.savedata.get(key);
}

deleteKeyInSAVE (args, util){
  const key = args.key;
  delete variables.savedata[key];
  return this.write(`M0 \n`);
}

setKeyInSAVE (args, util){
  const key = args.key;
  const value = args.value;
  variables.savedata.set(key, value)
  return this.write(`M0 \n`);
}

listKeysInSAVE (args, util){
  return Object.keys(variables.savedata);
}

}

module.exports = saveData;
