import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import type { Experience, Project, Social, Tech } from '@/types/site'
import type {
  UploadProjectMediaInput,
  UploadProjectMediaResult,
} from '@/server/admin'
import {
  deleteExperience,
  deleteProject,
  deleteSocial,
  deleteTech,
  reorderProjects,
  resetProjects,
  saveCvPath,
  saveExperience,
  saveProject,
  saveSocial,
  saveTech,
  uploadProjectMedia,
} from '@/server/admin'

interface OkResult {
  ok: boolean
}

export interface AdminMutations {
  saveProjectMutation: UseMutationResult<OkResult, Error, Project>
  uploadProjectMediaMutation: UseMutationResult<UploadProjectMediaResult, Error, UploadProjectMediaInput>
  reorderProjectsMutation: UseMutationResult<OkResult, Error, string[]>
  resetProjectsMutation: UseMutationResult<OkResult, Error, boolean>
  deleteProjectMutation: UseMutationResult<OkResult, Error, string>
  saveExperienceMutation: UseMutationResult<OkResult, Error, Experience>
  deleteExperienceMutation: UseMutationResult<OkResult, Error, string>
  saveSocialMutation: UseMutationResult<OkResult, Error, Social>
  deleteSocialMutation: UseMutationResult<OkResult, Error, number>
  saveTechMutation: UseMutationResult<OkResult, Error, Tech>
  deleteTechMutation: UseMutationResult<OkResult, Error, number>
  saveCvPathMutation: UseMutationResult<OkResult, Error, string>
}

export function useAdminMutations(onNotice: (message: string | null) => void): AdminMutations {
  const queryClient = useQueryClient()

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['site'] })
  }

  const onError = (error: Error) => onNotice(error.message)

  const saveProjectMutation = useMutation({
    mutationFn: (project: Project) => saveProject({ data: project }),
    onSuccess: async () => {
      onNotice('Project saved')
      await invalidate()
    },
    onError,
  })

  const uploadProjectMediaMutation = useMutation({
    mutationFn: (input: UploadProjectMediaInput) => uploadProjectMedia({ data: input }),
    onError,
  })

  const reorderProjectsMutation = useMutation({
    mutationFn: (ids: string[]) => reorderProjects({ data: ids }),
    onSuccess: async () => {
      onNotice('Project order saved')
      await invalidate()
    },
    onError,
  })

  const resetProjectsMutation = useMutation({
    mutationFn: (confirmed: boolean) => resetProjects({ data: confirmed }),
    onSuccess: async () => {
      onNotice('All projects reset')
      await invalidate()
    },
    onError,
  })

  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => deleteProject({ data: id }),
    onSuccess: async () => {
      onNotice('Project deleted')
      await invalidate()
    },
    onError,
  })

  const saveExperienceMutation = useMutation({
    mutationFn: (experience: Experience) => saveExperience({ data: experience }),
    onSuccess: async () => {
      onNotice('Experience saved')
      await invalidate()
    },
    onError,
  })

  const deleteExperienceMutation = useMutation({
    mutationFn: (id: string) => deleteExperience({ data: id }),
    onSuccess: async () => {
      onNotice('Experience deleted')
      await invalidate()
    },
    onError,
  })

  const saveSocialMutation = useMutation({
    mutationFn: (social: Social) => saveSocial({ data: social }),
    onSuccess: async () => {
      onNotice('Social saved')
      await invalidate()
    },
    onError,
  })

  const deleteSocialMutation = useMutation({
    mutationFn: (id: number) => deleteSocial({ data: id }),
    onSuccess: async () => {
      onNotice('Social deleted')
      await invalidate()
    },
    onError,
  })

  const saveTechMutation = useMutation({
    mutationFn: (tech: Tech) => saveTech({ data: tech }),
    onSuccess: async () => {
      onNotice('Tech saved')
      await invalidate()
    },
    onError,
  })

  const deleteTechMutation = useMutation({
    mutationFn: (id: number) => deleteTech({ data: id }),
    onSuccess: async () => {
      onNotice('Tech deleted')
      await invalidate()
    },
    onError,
  })

  const saveCvPathMutation = useMutation({
    mutationFn: (path: string) => saveCvPath({ data: path }),
    onSuccess: async () => {
      onNotice('CV path saved')
      await invalidate()
    },
    onError,
  })

  return {
    saveProjectMutation,
    uploadProjectMediaMutation,
    reorderProjectsMutation,
    resetProjectsMutation,
    deleteProjectMutation,
    saveExperienceMutation,
    deleteExperienceMutation,
    saveSocialMutation,
    deleteSocialMutation,
    saveTechMutation,
    deleteTechMutation,
    saveCvPathMutation,
  }
}
