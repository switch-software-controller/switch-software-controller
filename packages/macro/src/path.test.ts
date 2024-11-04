import type { PathJoiner } from '@switch-software-controller/path-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { MacroPathImpl } from './path.ts';

describe(MacroPathImpl, () => {
  let joiner: PathJoiner;
  let path: MacroPathImpl;

  beforeEach(() => {
    joiner = (...args) => args.join('/');
    path = new MacroPathImpl('./macroRoot', 'macroName', joiner);
  });

  describe('defaultImageExtension', () => {
    it('should return the default image extension', () => {
      expect(path.defaultImageExtension).toBe('png');
    });

    it('should set the default image extension', () => {
      path.defaultImageExtension = 'jpg';
      expect(path.defaultImageExtension).toBe('jpg');
    });

    it('should not set the default image extension if it is empty', () => {
      path.defaultImageExtension = '';
      expect(path.defaultImageExtension).toBe('png');
    });

    it('should not set the default image extension if it is null', () => {
      path.defaultImageExtension = '    ';
      expect(path.defaultImageExtension).toBe('png');
    });
  });

  describe('root', () => {
    it('should return the root path', () => {
      expect(path.root).toBe('./macroRoot/macroName');
    });
  });

  describe('macro', () => {
    it('should return the macro path', () => {
      expect(path.macro).toBe('./macroRoot/macroName/src/index.ts');
    });
  });

  describe('info', () => {
    it('should return the info path', () => {
      expect(path.info).toBe('./macroRoot/macroName/info.json');
    });
  });

  describe('templates', () => {
    it('should return the templates path', () => {
      expect(path.templates).toBe('./macroRoot/macroName/templates');
    });
  });

  describe('captures', () => {
    it('should return the captures path', () => {
      expect(path.captures).toBe('./macroRoot/macroName/captures');
    });
  });

  describe('template', () => {
    it('should return the template path', () => {
      expect(path.template('file')).toBe(
        './macroRoot/macroName/templates/file.png',
      );
    });

    it('should return the template path with the specified extension', () => {
      expect(path.template('file', 'jpg')).toBe(
        './macroRoot/macroName/templates/file.jpg',
      );
    });
  });

  describe('capture', () => {
    it('should return the capture path', () => {
      expect(path.capture('file')).toBe(
        './macroRoot/macroName/captures/file.png',
      );
    });

    it('should return the capture path with the specified extension', () => {
      expect(path.capture('file', 'jpg')).toBe(
        './macroRoot/macroName/captures/file.jpg',
      );
    });
  });
});
